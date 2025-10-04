"use client"

import { Button, Checkbox } from "antd"
import { useState, useMemo, useCallback, useEffect } from "react"

import { SelectableItem, SelectableItemTree } from "./SelectableItemTree"

// ---- Helpers giữ nguyên của bạn ----
const transformData = (data: any[]): SelectableItem[] => {
  return data
    .map((account) => {
      const transformedAccount: SelectableItem = {
        id: account.ads_account_id,
        name: account.ads_account_name,
        originalData: account,
        status: account.status,
      }

      if (account.campaigns?.length > 0) {
        transformedAccount.children = account.campaigns.map((campaign: any) => {
          const transformedCampaign: SelectableItem = {
            id: campaign.campaign_id,
            name: campaign.campaign_name,
            originalData: campaign,
            status: campaign.status,
          }

          if (campaign.adsets?.length > 0) {
            transformedCampaign.children = campaign.adsets.map((adset: any) => {
              const transformedAdset: SelectableItem = {
                id: adset.adset_id,
                name: adset.adset_name,
                originalData: adset,
                status: adset.status,
              }

              if (adset.ads?.length > 0) {
                transformedAdset.children = adset.ads.map((ad: any) => ({
                  id: ad.ad_id,
                  name: ad.ad_name,
                  originalData: ad,
                  status: ad.status,
                }))
              }
              return transformedAdset
            })
          }
          return transformedCampaign
        })
      }
      return transformedAccount
    })
    .filter((item) => item.id !== "all")
}

const sortAndCollectActive = (
  items: SelectableItem[],
  activeIds: { accounts: Set<string>; campaigns: Set<string>; adsets: Set<string>; ads: Set<string> },
  level: number
): SelectableItem[] => {
  const sortedItems = [...items].sort((a, b) => {
    if (a.status === "ACTIVE" && b.status !== "ACTIVE") return -1
    if (a.status !== "ACTIVE" && b.status === "ACTIVE") return 1
    return 0
  })

  return sortedItems.map((item) => {
    if (item.status === "ACTIVE") {
      if (level === 0) activeIds.accounts.add(item.id)
      else if (level === 1) activeIds.campaigns.add(item.id)
      // không auto chọn adset/ads ở đây
    }

    if (item.children && item.children.length > 0) {
      // eslint-disable-next-line no-param-reassign
      item.children = sortAndCollectActive(item.children, activeIds, level + 1)
    }
    return item
  })
}

// Gom tất cả ID ACTIVE theo các tầng (dùng cho nút Active)
const collectActiveIds = (items: SelectableItem[]) => {
  const acc = new Set<string>()
  const camp = new Set<string>()
  const adset = new Set<string>()
  const ad = new Set<string>()

  const dfs = (nodes: SelectableItem[], level: number) => {
    for (const n of nodes) {
      if (n.status === "ACTIVE") {
        if (level === 0) acc.add(n.id)
        else if (level === 1) camp.add(n.id)
        else if (level === 2) adset.add(n.id)
        else if (level === 3) ad.add(n.id)
      }
      if (n.children?.length) dfs(n.children, level + 1)
    }
  }

  dfs(items, 0)
  return { acc, camp, adset, ad }
}

interface AdAccountSelectorProps {
  setFilterData: any
  filterData: any
  setIsOpenADS: any
  dataS: any
}

export default function AdAccountSelector({ setFilterData, filterData, setIsOpenADS, dataS }: AdAccountSelectorProps) {
  const [selectionType] = useState<"all" | "specific">("specific")
  const [searchTerm] = useState("")
  const [isActive, setIsActive] = useState<boolean>(false)

  // Chuẩn hoá + sắp xếp
  const initialActiveIds = useMemo(
    () => ({
      accounts: new Set<string>(),
      campaigns: new Set<string>(),
      adsets: new Set<string>(),
      ads: new Set<string>(),
    }),
    []
  )

  const sortedAndTransformedAccounts = useMemo(() => {
    const transformed = transformData(dataS || [])
    initialActiveIds.accounts.clear()
    initialActiveIds.campaigns.clear()
    initialActiveIds.adsets.clear()
    initialActiveIds.ads.clear()
    return sortAndCollectActive(transformed, initialActiveIds, 0)
  }, [dataS, initialActiveIds])

  // ====== XÂY DỰNG INDEX CHO QUAN HỆ CHA-CON (dựa trên cây) ======
  const indexes = useMemo(() => {
    const adsUnderAdset: Record<string, string[]> = {}
    const adsetsByCampaign: Record<string, string[]> = {}
    const campaignsByAccount: Record<string, string[]> = {}
    const adsUnderCampaign: Record<string, string[]> = {}
    const adsUnderAccount: Record<string, string[]> = {}

    for (const acc of sortedAndTransformedAccounts) {
      const campIds: string[] = []
      const accAds: string[] = []

      for (const camp of acc.children || []) {
        campIds.push(camp.id)
        const adsetIds: string[] = []
        const campAds: string[] = []

        for (const aset of camp.children || []) {
          adsetIds.push(aset.id)
          const asetAds = (aset.children || []).map((a) => a.id)
          adsUnderAdset[aset.id] = asetAds
          campAds.push(...asetAds)
        }

        adsetsByCampaign[camp.id] = adsetIds
        adsUnderCampaign[camp.id] = campAds
        accAds.push(...campAds)
      }

      campaignsByAccount[acc.id] = campIds
      adsUnderAccount[acc.id] = accAds
    }

    return { adsUnderAdset, adsetsByCampaign, campaignsByAccount, adsUnderCampaign, adsUnderAccount }
  }, [sortedAndTransformedAccounts])

  // ====== STATE SELECTION ======
  // Quy ước: trạng thái cha (adset/campaign/account) được SUY RA từ selectedAdIds
  const [selectedAdIds, setSelectedAdIds] = useState<Set<string>>(new Set())
  const [selectedAdsetIds, setSelectedAdsetIds] = useState<Set<string>>(new Set())
  const [selectedCampaignIds, setSelectedCampaignIds] = useState<Set<string>>(new Set())
  const [selectedAccountIds, setSelectedAccountIds] = useState<Set<string>>(new Set())

  // Hàm tính ngược từ ad -> adset -> campaign -> account
  const recalcUpFromAds = useCallback(
    (nextAdIds: Set<string>) => {
      // adset: có ít nhất 1 ad thuộc adset được chọn
      const nextAdsetIds = new Set<string>()
      for (const [adsetId, adIds] of Object.entries(indexes.adsUnderAdset)) {
        if (adIds.some((aid) => nextAdIds.has(aid))) nextAdsetIds.add(adsetId)
      }

      // campaign: có ít nhất 1 adset thuộc campaign được chọn
      const nextCampaignIds = new Set<string>()
      for (const [campaignId, adsetIds] of Object.entries(indexes.adsetsByCampaign)) {
        if (adsetIds.some((asid) => nextAdsetIds.has(asid))) nextCampaignIds.add(campaignId)
      }

      // account: có ít nhất 1 campaign thuộc account được chọn
      const nextAccountIds = new Set<string>()
      for (const [accountId, campaignIds] of Object.entries(indexes.campaignsByAccount)) {
        if (campaignIds.some((cid) => nextCampaignIds.has(cid))) nextAccountIds.add(accountId)
      }

      setSelectedAdIds(nextAdIds)
      setSelectedAdsetIds(nextAdsetIds)
      setSelectedCampaignIds(nextCampaignIds)
      setSelectedAccountIds(nextAccountIds)
    },
    [indexes]
  )

  // Auto-chọn ACTIVE khi bật isActive, và clear khi tắt
  useEffect(() => {
    if (!isActive) {
      recalcUpFromAds(new Set()) // clear hết
      return
    }
    // Bật Active: lấy toàn bộ ad ACTIVE (và để hàm recalcUpFromAds suy ra cha)
    const { ad } = collectActiveIds(sortedAndTransformedAccounts)
    recalcUpFromAds(ad)
  }, [isActive, sortedAndTransformedAccounts, recalcUpFromAds])

  // ====== TOGGLE ======
  const toggleItemSelection = useCallback(
    (id: string, checked: boolean, item: SelectableItem, level: number) => {
      // Tất cả logic chọn/bỏ được chuẩn hoá về ad-ids,
      // sau đó tính ngược lên để đảm bảo rule “con quyết định cha”.
      const nextAdIds = new Set(selectedAdIds)

      if (level === 3) {
        // ad
        checked ? nextAdIds.add(id) : nextAdIds.delete(id)
      } else if (level === 2) {
        // adset
        const under = indexes.adsUnderAdset[id] || []
        if (checked) under.forEach((aid) => nextAdIds.add(aid))
        else under.forEach((aid) => nextAdIds.delete(aid))
      } else if (level === 1) {
        // campaign
        const under = indexes.adsUnderCampaign[id] || []
        if (checked) under.forEach((aid) => nextAdIds.add(aid))
        else under.forEach((aid) => nextAdIds.delete(aid))
      } else if (level === 0) {
        // account
        const under = indexes.adsUnderAccount[id] || []
        if (checked) under.forEach((aid) => nextAdIds.add(aid))
        else under.forEach((aid) => nextAdIds.delete(aid))
      }

      recalcUpFromAds(nextAdIds)
    },
    [selectedAdIds, indexes, recalcUpFromAds]
  )

  const handleDeselectAll = () => {
    recalcUpFromAds(new Set())
  }

  const filteredAccounts = useMemo(() => {
    if (!searchTerm) return sortedAndTransformedAccounts
    const kw = searchTerm.toLowerCase()
    return sortedAndTransformedAccounts.filter(
      (account) => account.name.toLowerCase().includes(kw) || account.id.toLowerCase().includes(kw)
    )
  }, [searchTerm, sortedAndTransformedAccounts])

  const selectedAccountCount = selectedAccountIds.size
  const totalAccountCount = sortedAndTransformedAccounts.length

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "800px",
        borderRadius: "8px",
        border: "1px solid #e8e8e8",
        backgroundColor: "#fff",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.09)",
        padding: "24px",
      }}
    >
      <h2 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "16px" }}>Tài khoản quảng cáo</h2>

      {selectionType === "specific" && (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "0.875rem",
              color: "#8c8c8c",
              marginBottom: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <span>
                Đang hiển thị {filteredAccounts.length}/{totalAccountCount} tài khoản
              </span>

              <div style={{ marginLeft: 30 }}>
                <Checkbox checked={isActive} onChange={(e) => setIsActive(e.target.checked)} /> <span>Active</span>
              </div>
            </div>

            {selectedAccountCount > 0 && (
              <Button type="link" style={{ padding: 0, height: "auto", color: "#1890ff" }} onClick={handleDeselectAll}>
                Bỏ chọn
              </Button>
            )}
          </div>

          <div style={{ maxHeight: "384px", overflowY: "auto", paddingRight: "8px" }}>
            {filteredAccounts.length > 0 ? (
              filteredAccounts.map((account) => (
                <SelectableItemTree
                  key={account.id}
                  item={account}
                  level={0}
                  selectedIds={{
                    accounts: selectedAccountIds,
                    campaigns: selectedCampaignIds,
                    adsets: selectedAdsetIds,
                    ads: selectedAdIds,
                  }}
                  onToggle={toggleItemSelection}
                  disabled={false}
                />
              ))
            ) : (
              <div style={{ textAlign: "center", color: "#8c8c8c", padding: "16px 0" }}>Không tìm thấy tài khoản nào.</div>
            )}
          </div>
        </>
      )}

      {selectionType === "all" && (
        <div style={{ maxHeight: "384px", overflowY: "auto", paddingRight: "8px" }}>
          {sortedAndTransformedAccounts
            .filter((acc) => acc.originalData?.is_use)
            .map((account) => (
              <SelectableItemTree
                key={account.id}
                item={account}
                level={0}
                selectedIds={{
                  accounts: selectedAccountIds,
                  campaigns: selectedCampaignIds,
                  adsets: selectedAdsetIds,
                  ads: selectedAdIds,
                }}
                onToggle={toggleItemSelection}
                disabled={true}
              />
            ))}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "24px" }}>
        <Button
          onClick={() => {
            setIsOpenADS(false)
          }}
        >
          Đóng
        </Button>
        <Button
          onClick={() => {
            setFilterData({
              ...filterData,
              ad_ids: Array.from(selectedAdIds),
              campaign_ids: Array.from(selectedCampaignIds),
              ads_account_id: Array.from(selectedAccountIds)[0],
            })
            setIsOpenADS(false)
            console.log(
              Array.from(selectedAdIds),
              Array.from(selectedAdsetIds),
              Array.from(selectedCampaignIds),
              Array.from(selectedAccountIds)
            )
          }}
        >
          Xác nhận
        </Button>
      </div>
    </div>
  )
}
