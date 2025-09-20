/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-cycle */
import { createAsyncThunk, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DropdownData } from "components/atoms/Dropdown";
import { GroupRadioType } from "components/atoms/GroupRadio";
import { TransferType } from "components/atoms/Transfer";
import Cookies from "js-cookie";
import { ServiceItem } from "services/api/Example/types";
import { getPackagesItems, getResourceCRM } from "services/api/dashboard";
import { DmsData, PackageResponse, ServiceGroup } from "services/api/dashboard/types";
import { InfoUserType, Role, UserCallAgent } from "services/types";

interface HomeState {
  tokenUser: string;
  shortName: string;
  callAgent: UserCallAgent;
  roleUser: Role[];
  info: InfoUserType;
  resource: DmsData;
  packageItems: PackageResponse;
  dataLaunchSource: DropdownData[];

}

const initialState: HomeState = {
  tokenUser: "",
  shortName: "",
  callAgent: {
    user_id: "",
    display_phone_agent: "",
    phone_agent: "",
    phone_agent_password: "",
    phone_queue: "",
    phone_browser_default: "",
    phone_server_domain: "",
    phone_server_port: 0,
    phone_server_type: "",
    phone_cs_url: "",
    sip_realm: "",
    sip_ws_url: "",
  },
  roleUser: [],
  packageItems: {
    data: [],
    message: "",
    status: false,
    total_items: 0,
    client_ip: "",
  },
  info: {
    username: "",
    fullname: "",
    lastname: "",
    employee_signature_name: "",
    token: "",
    clinic_id: 1,
    department_id: "",
    employee_id: "",
    employee_group: "",
    employee_team_id: "",
    user_country_id: "",
    user_country_phone_prefix: "",
    user_call_agent: "",
    roles: [],
  },
  resource: {
    data: {
      clinics: [],
      phone_config: {
        user_id: "",
        display_phone_agent: "",
        phone_agent: "",
        phone_agent_password: "",
        phone_queue: "",
        phone_browser_default: "",
        phone_server_domain: "",
        phone_server_port: 0,
        phone_server_type: "",
        phone_cs_url: "",
      },
      genders: [],
      task_texts: [],
      careers: [],
      nations: [],
      evaluation_criterias: [],
      ads_accounts: [],
      users:[],
      categories:[],
      maritalstatus: [],
      relationtypes: [],
      countries: [],
      source_groups: [],
      sources: [],
      source_types: [],
      task_types: [],
      userguid_types: [],
      stages: [],
      departments: [],
      teams: [],
      appointment_types: [],
      appointment_services: [],
      packages: [],
      employees: [],
      current_user:"",
      services: [],
      affiliates: [],
      insurance_injuries: [],
      insurance_specialists: [],
      tags: [],
      vouchers: [],
      cs_schedule_type: [],
      touchpointlog_types: [],
      steps_process_lead: [],
      userflow_lead_steps: [],
      userflow_types: [],
       dc_dm_cschedules: [],
      dc_dm_cschedules_status: [],
      dm_time_doctor_schedules: [],
      dm_year_doctor_schedules: [],
      dc_dm_staffs:[]
    },
    message: "",
    status: false,
    client_ip: "",
  },
  dataLaunchSource: [],
};

export const getListResourceCRM = createAsyncThunk<
  DmsData,
  void,
  { rejectValue: any }
>("mapsReducer/getProjectsHomeAction", async (_, { rejectWithValue }) => {
  try {
    const response = await getResourceCRM();
    // call api lấy all danh sách ở các select box chỗ thêm khách hàng mới: giới tính, đối tác, dân tộc, nghề nghiệp,... và còn có thông tin user đăng nhập, từ đây sẽ gán dữ liệu ở file sau và
    // sẽ gán vào localstorage
    return response;
  } catch (error) {
    console.log("🚀 ~ file: home.ts:111 ~ > ~ error:", error);
    return rejectWithValue(error);
  }
});
export const getListServiceWItems = createAsyncThunk<
PackageResponse,
  void,
  { rejectValue: any }
>("mapsReducer/getLSWIAction", async (_, { rejectWithValue }) => {
  try {
    const response = await getPackagesItems();
    return response;
  } catch (error) {
    console.log("🚀 ~ file: home.ts:111 ~ > ~ error:", error);
    return rejectWithValue(error);
  }
});
export const homeSlice = createSlice({
  name: "homeReducer",
  initialState,
  reducers: {
    setTokenUser($state, action: PayloadAction<string>) {
      $state.tokenUser = action.payload;
    },
    setShortName($state, action: PayloadAction<string>) {
      $state.shortName = action.payload;
    },
    setInfoUserAgent($state, action: PayloadAction<UserCallAgent>) {
      $state.callAgent = action.payload;
    },
    setRoleUser($state, action: PayloadAction<Role[]>) {
      $state.roleUser = action.payload;
    },
    setInforUser($state, action: PayloadAction<InfoUserType>) {
      $state.info = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(getListResourceCRM.fulfilled, ($state, action) => {
      const {
        sources,
        source_groups,
        source_types,
        nations,
        affiliates,
        genders,
        careers,
        packages,
        tags,
        categories,
        employees,
        task_types,
        task_texts,
        userguid_types,
        teams,
        stages,
        phone_config,
        services,
        appointment_types,
        appointment_services,
        vouchers,
        cs_schedule_type,
        current_user,
        touchpointlog_types,
        userflow_lead_steps,
        userflow_types,
        users,
        evaluation_criterias,
        ads_accounts,
        dm_time_doctor_schedules,
        dc_dm_cschedules_status,
        dc_dm_cschedules,
        dm_year_doctor_schedules,
        dc_dm_staffs,
        ...prevData
      } = action.payload.data;
      console.log(action.payload.data);
      const newAppointmentTypes: GroupRadioType[] = [];
      const newVouchersTypes: GroupRadioType[] = [];
      const newLaunchSources: DropdownData[] = [];
      const newLaunchSourcesGroups: DropdownData[] = [];
      const newLaunchSourcesTypes: DropdownData[] = [];
      const newNations: DropdownData[] = [];
      const newAffiliates: DropdownData[] = [];
      const newGenders: DropdownData[] = [];
      const newFType: DropdownData[] = [];
      const newCareers: DropdownData[] = [];
      const newPackages: DropdownData[] = [];
      const newCategories: DropdownData[] = [];
      const newTagType: DropdownData[] = [];
      const newcs_schedule_type: DropdownData[] = [];
      const newDoctorOnline: DropdownData[] = [];
      const newGroupTask: DropdownData[] = [];
       const newGroupTaskTexts: DropdownData[] = [];
      const newEmployeeTeams: DropdownData[] = [];
       const newdc_dm_cschedules: DropdownData[] = [];
      const newdc_dm_cschedules_status: DropdownData[] = [];
      const newdm_time_doctor_schedules: DropdownData[] = [];
      const newdm_year_doctor_schedules: DropdownData[] = [];
      const newStepProcessLead: DropdownData[] = [];
      const newUserTypes: DropdownData[] = [];
      const newUserguidTypes: DropdownData[] = [];
      const newTags: TransferType[] = [];
      const newTouchPointLogType: DropdownData[] = [];
      const newTagsMultiSelect: DropdownData[] = [];
      const newAdsAccount: DropdownData[] = [];
      const newCampaignCriteria: DropdownData[] = [];
      const newListUsers: DropdownData[] = [];
      const ListTagPhareTranfer: TransferType[] = [];
      const listPharesBeforeExams: DropdownData[] = [];
      const listGenders: DropdownData[] = [];
      const listServiceConverted: ServiceGroup[] = [];
      const listEndoscopics: DropdownData[] = [];
       const newListDmDcStaff: DropdownData[] = [];
      const listCSKH: GroupRadioType[] = [];

      const colors = ["#28a745", "#17a2b8", "#dc3545", "#20c997", "#333"];
      const listServicesAllowGroup: any[] = [];
      services?.length &&
        ((services as unknown as ServiceItem[]) || []).map(
          (item: ServiceItem) => {
            const checkGroupIsExit = listServicesAllowGroup.find(
              (i) => i.service_group_id === item.service_group_id
            );

            const newGroup = {
              service_group_id: item.service_group_id,
              service_group_name: item.service_group_name,
              service_group_item: [
                {
                  ...item,
                  id: item.service_id,
                  label: item.service_name,
                  value: item.service_id,
                },
              ],
            };

            if (checkGroupIsExit) {
              checkGroupIsExit.service_group_item.push({
                ...item,
                id: item.service_id,
                label: item.service_name,
                value: item.service_id,
              } as any);
            } else {
              listServicesAllowGroup.push(newGroup as any);
            }
          }
          
        );
      // hai đoạn code dưới để xử lý data có giá tiền cho đúng vd như dữ liệu của endoscopicts
      // appointment_services.length &&
      //   appointment_services.map((item, index) => {
      //     const newItem = {
      //       id: item.service_id,
      //       label: `${
      //         item.service_displayname
      //       }  (${item.service_prices.toLocaleString("vi-VN")} vnd)`,
      //       value: item.policy_key,
      //       policy_key: item.policy_key,
      //       is_used: item.is_used,
      //     };
      //     if (item.appointment_type === "endoscopics" && item.is_used) {
      //       listEndoscopics.push(newItem as unknown as DropdownData);
      //     }
      //   });

      // appointment_services.length &&
      //   appointment_services.map((item, index) => {
      //     const convertStages = {
      //       id: item.service_id,
      //       label: `${
      //         item.service_displayname
      //       }  (${item.service_prices.toLocaleString("vi-VN")} vnd)`,
      //       value: item.service_id,
      //       policy_key: item.policy_key,
      //     };
      //     if (item.appointment_type === "package" && item.is_used) {
      //       newPackages.push(convertStages as unknown as DropdownData);
      //     }
      //   });

       appointment_types?.length &&
         appointment_types.map((item, index) => {
           const newItem = {
             id: item.service_id,
             label: item.service_name,
             value: item.appointment_type,
             color: colors[index],
             department_id: item.department_id,
             is_register_package: item.is_register_package,
             is_register_subclinical: item.is_register_subclinical,
             is_exams: item.is_exams,
             register_type_id: item.register_type_id,
             index: item.index

           };
           newAppointmentTypes.push(newItem as unknown as GroupRadioType);
         });
        // categories.length &&
        // categories.map((item, index) => {
        //   const newItem = {
        //     id: item.id,
        //     category_type: item.category_type,
        //     category_name: item.category_name,
        //     category_note: item.category_note,
        //     sequence: item.sequence,
        //     is_show: item.is_show,
        //     label: item.category_name,
        //     value: item.id + 1,

        //   };
        //   newCategories.push(newItem as unknown as GroupRadioType);
        // });
       ads_accounts?.length &&
        ads_accounts.map((item, index) => {
          const newItem = {
            ads_account_id: item.ads_account_id,
            ads_account_name: item.ads_account_name,
            ads_account_type: item.ads_account_type,
            is_use: item.is_use,
            order_numbers: item.order_numbers,
            label: item.ads_account_name === "All" ? "Tất cả" : item.ads_account_name + " (" + item.ads_account_id + ")",
            value: item.ads_account_id,
            campaigns: item.campaigns || [],

          };
          newAdsAccount.push(newItem as unknown as GroupRadioType);
        });
       userguid_types?.length &&
        userguid_types.map((item, index) => {
          const newItem = {
            guid_type_id: item.guid_type_id,
            guid_type_name: item.guid_type_name,
            is_show: item.is_show,
            label: item.guid_type_name,
            value: item.sequence,
            id: item.sequence,

          };
          newUserguidTypes.push(newItem as unknown as GroupRadioType);
        });
        !!dc_dm_cschedules_status?.length &&
          dc_dm_cschedules_status.map((item) => {
          const convertStages = {
            label: item.value_text,
            value: item.key,

          };
          newdc_dm_cschedules_status.push(convertStages as unknown as DropdownData);
          });
        !!dc_dm_staffs?.length &&
          dc_dm_staffs?.map((item) => {
            const convertStages = {
              staffcode: item.staffcode,
              staffname: item.staffname,
              job_title: item.job_title,

            label: item.staffname,
            value: item.staffcode,

          };
          newListDmDcStaff.push(convertStages as unknown as DropdownData);
          });
      !!dm_time_doctor_schedules?.length &&
          dm_time_doctor_schedules.map((item) => {
        const convertStages = {
      label: item.key === "Đã trôi qua" ? "(Đã trôi qua)" : item.key,
      value: item.value_int,
    };
          newdm_time_doctor_schedules.push(convertStages as unknown as DropdownData);
          });
      newdc_dm_cschedules.push({
  label: "Tất cả",
  value: "all"
} as unknown as DropdownData);
       !!dc_dm_cschedules?.length &&
          dc_dm_cschedules.map((item) => {
          const convertStages = {
            c_schedule_type_id: item.c_schedule_type_id,
            c_schedule_title: item.c_schedule_title,
            c_schedule_note: item.c_schedule_note,
            sequence: item.sequence,
            label: item.c_schedule_title,
            value: item.c_schedule_type_id
            };
           
          newdc_dm_cschedules.push(convertStages as unknown as DropdownData);
          });
    
       !!dm_year_doctor_schedules?.length &&
          dm_year_doctor_schedules.map((item) => {
          const convertStages = {
            label: item.key,
            value: item.value_int
            };
           
          newdm_year_doctor_schedules.push(convertStages as unknown as DropdownData);
          });
       evaluation_criterias?.length &&
        evaluation_criterias.map((item, index) => {
          const newItem = {
            criteria_id: item.criteria_id,
            criteria_code: item.criteria_code,
            criteria_name: item.criteria_name,
            type_campaign: item.type_campaign,
            order_numbers: item.order_numbers,
            target_unit: item.target_unit,
            result_unit: item.result_unit,
            is_high_light: item.is_high_light,
            color_code: item.color_code,
            is_show: item.is_show,
            label: item.criteria_name,
            value: item.criteria_id,

          };
          newCampaignCriteria.push(newItem as unknown as GroupRadioType);
        });
        users?.length &&
        users.map((item, index) => {
          const newItem = {
              u_id: item.employee_id,
              u_type:item.employee_type,
           
              signature_name:item.employee_signature_name,
              erp_code: item.erp_code,
              erp_type: item.erp_type,
            employee_team_id: item.employee_team_id,
            employee_group:item.employee_group,
            label: item.employee_signature_name,
            value: item.employee_team_id,
            team_ids: item.team_ids,
            signatures: item.signatures
          };
          newListUsers.push(newItem as unknown as GroupRadioType);
        });
        // vouchers.length &&
        //   vouchers.map((item, index) => {
        //     if (index === 0) {
        //        const newItem = {
            
        //     id: null,
        //     label: "Không chọn mã giảm giá",
        //     valueV: null,
        //     value: "noValue",
          

        //   };
        //     newVouchersTypes.push(newItem as unknown as DropdownData);
        //   }
        //   const newItem = {
            
        //     id: item.voucher_code,
        //     label: item.voucher_name,
        //     valueV: item.voucher_value,
        //     value: item.voucher_code,
          

        //   };
        //   newVouchersTypes.push(newItem as unknown as DropdownData);
        //   });
      
        // !!nations.length &&
        // nations.map((item) => {
        //   const convertStages = {
        //     id: item.nation_id,
        //     label: item.nation_name,
        //     value: item.nation_id,
        //   };
        //   newNations.push(convertStages as unknown as DropdownData);
        // });

      !!source_groups?.length &&
      source_groups.map((item:any) => {
          const convertStages = {
            id: item.launch_source_group_id,
            label: item.launch_source_group_name,
            value: item.launch_source_group_id,
          };
          // if (item.launch_source_group_name === "khamdoanhnghiep.vn") {
          //   return;
          // }
          newLaunchSourcesGroups.push(convertStages as unknown as DropdownData);
        });
        !!touchpointlog_types?.length &&
        touchpointlog_types.map((item:any) => {
            const convertStages = {
              id: item.id,
              label: item.name,
              value: item.id,
            };
           
            newTouchPointLogType.push(convertStages as unknown as DropdownData);
        });
        !!userflow_lead_steps?.length &&
        userflow_lead_steps.map((item:any) => {
            const convertStages = {
              id: item.step_index,
              label: item.step_name,
              value: item.step_index,
              type: item.type,
              step_note: item.step_note,
            };
           
            newStepProcessLead.push(convertStages as unknown as DropdownData);
        });
         const convertTagType = {
              id: "lead",
           label:"lead",
              value: "lead",
            };
           
      newTagType.push(convertTagType as unknown as DropdownData);
      const convertTagType1 = {
        id: "customer",
     label:"customer",
        value: "customer",
      };
     
      newTagType.push(convertTagType1 as unknown as DropdownData);
      const convertTagType2 = {
        id: "task",
     label:"task",
        value: "task",
      };
     
      newTagType.push(convertTagType2 as unknown as DropdownData);
        !!userflow_types?.length &&
        userflow_types.map((item:any) => {
            const convertStages = {
              id: item.id,
              label: item.name,
              value: item.id,
            
            };
            newUserTypes.push(convertStages as unknown as DropdownData);
          });
      !!sources.length &&
        sources.map((item:any) => {
          const convertStages = {
            id: item.launch_source_id,
            label: item.launch_source_name,
            value: item.launch_source_id,
          };
          newLaunchSources.push(convertStages as unknown as DropdownData);
        });
       
           !!cs_schedule_type.length &&
           cs_schedule_type.map((item) => {
           const convertStages = {
             id: item.id,
             name:  item.name,
             task_title: item.task_title,
             task_content: item.task_content,
             task_execute_day: item.task_execute_day,
             next_task_id: item.next_task_id,
             sequence: item.sequence,
             label: item.name,
             value:item.id
           };
           newcs_schedule_type.push(convertStages as unknown as DropdownData);
         });
      !!source_types.length &&
        source_types.map((item) => {
          const convertStages = {
            id: item.launch_source_type_id,
            label: item.launch_source_type_name,
            value: item.launch_source_type_id,
          };
          newLaunchSourcesTypes.push(convertStages as unknown as DropdownData);
        });

      // !!stages.length &&
      //   stages.map((item) => {
      //     const convertStages = {
      //       id: item.stage_id,
      //       label: item.stage_name,
      //       value: item.stage_id,
      //     };
      //     if (item?.type === "before") {
      //       listPharesBeforeExams.push(
      //         convertStages as unknown as DropdownData
      //       );
      //     }
      //   });

      !!nations.length &&
        nations.map((item) => {
          const convertStages = {
            id: item.nation_id,
            label: item.nation_name,
            value: item.nation_id,
          };
          newNations.push(convertStages as unknown as DropdownData);
        });

     !!affiliates.length &&
         affiliates.map((item) => {
          const convertStages = {
             id: item.affiliate_id,
             label: item.display_name,
             value: item.affiliate_id,
             affiliate_code: item.affiliate_code,
             affiliate_type: item.affiliate_type,
             launch_source_id: item.launch_source_id,
           };
           newAffiliates.push(convertStages as unknown as DropdownData);
         });

      const convertstages = {
        id:1,
       label: "Nam",
         value: "M",
        };
      newGenders.push(convertstages as unknown as DropdownData);
      const convertstages2 = {
        id:1,
       label: "Nữ",
         value: "F",
        };
        newGenders.push(convertstages2 as unknown as DropdownData);
      // !!careers.length &&
      //   careers.map((item, index) => {
      //     const convertStages = {
      //       id: index + 1,
      //       label: item.career_name,
      //       value: item.career_id,
      //     };
      //     newCareers.push(convertStages as unknown as DropdownData);
      //   });

      // !!employees.length &&
      //   employees.map((item: any, index: number) => {
      //     const convertStages = {
      //       id: index + 1,
      //       label: item.employee_signature_name,
      //       value: item.employee_id,
      //     };
      //     if (item.employee_team_id === "BSKNTH") {
      //       newDoctorOnline.push(convertStages as unknown as DropdownData);
      //     }
      //   });

      // !!employees.length &&
      //   employees.map((item: any, index) => {
      //     const convertStages = {
      //       id: item?.employee_id,
      //       label: item?.employee_signature_name,
      //       value: item.employee_id,
      //       employee_type: item.employee_type,
      //       color: colors[1],
      //       employee_team_id: item?.employee_team_id,
      //       erp_code: item?.erp_code,
      //       erp_type: item?.erp_type,
      //     };

      //     if (item.employee_team_id === "CSKH") {
      //       listCSKH.push(convertStages as unknown as GroupRadioType);
      //     }
      //   });

      !!tags.length &&
      tags.map((item: any, index: any) => {
      
        const convertedTag = {
          tag_id: item.tag_id,
          tag_name: item.tag_name,
          tag_type: item.tag_type,
          sequence: item.sequence,
          tag_color: item.tag_color,
          is_show: item.is_show,
          label: item.tag_name,
          value: item.tag_id,
        };
      
        newTags.push(convertedTag as any);
      });
      const convertedFType = {
      
        label: "F1",
        value:"F1",
      };
    
      newFType.push(convertedFType as any);
      const convertedFType2 = {
      
        label: "F2",
        value:"F2",
      };
    
      newFType.push(convertedFType2 as any);
      const convertedFType3 = {
      
        label: "F3",
        value:"F3",
      };
    
      newFType.push(convertedFType3 as any);
      !!services.length &&
        services.map((serviceItem: any, index: any) => {
          const existingGroup = listServiceConverted.find(
            (group) => group.service_group_id === serviceItem.service_group_id
          );

          if (existingGroup) {
            existingGroup?.children?.push(serviceItem as any);
          } else {
            const newGroupService = {
              service_group_id: serviceItem.service_group_id,
              service_group_name: serviceItem.service_group_name,
              service_group_type: serviceItem.service_group_type,
              children: [serviceItem],
            };
            listServiceConverted.push(newGroupService);
          }
        });

      // !!tags.length &&
      //   tags.map((item: any, index: any) => {
      //     const newTagMultiSelect: DropdownData = {
      //       id: item?.tag_id,
      //       label: item?.tag_name,
      //       value: item?.tag_id,
      //     };

      //     if (item?.tag_group !== "htkh") {
      //       newTagsMultiSelect.push(newTagMultiSelect as DropdownData);
      //     }
      //   });

       !!task_types.length &&
         task_types.map((item, index) => {
           const convertStages = {
             id: index + 1,
             label: item.task_type_name,
             value: item.task_type_id,
             task_type_group: item.task_type_group,
              task_type_id: item.task_type_id
           };
           newGroupTask.push(convertStages as unknown as DropdownData);
         });
         
       !!task_texts.length &&
         task_texts.map((item, index) => {
           const convertStages = {
             id: index + 1,
             label: item.task_text_display,
             value: item.task_text_display,
              task_type_id: item.task_type_id 
           };
           newGroupTaskTexts.push(convertStages as unknown as DropdownData);
         });

       !!teams.length &&
         teams.map((item:any, index:any) => {
           const convertStages = {
             id: index + 1,
             label: item.employee_team_name,
             value: item.employee_team_id,
           };
           newEmployeeTeams.push(convertStages as unknown as DropdownData);
         });
         localStorage.setItem(
          "employeeTeams",
          JSON.stringify(newEmployeeTeams)
        );
      localStorage.setItem(
        "listPharesBeforeExams",
        JSON.stringify(listPharesBeforeExams)
      );
         localStorage.setItem(
        "listStaff",
        JSON.stringify(newListDmDcStaff)
      );
      localStorage.setItem("doctorOnline", JSON.stringify(newDoctorOnline));
      localStorage.setItem("endoscopics", JSON.stringify(listEndoscopics));
       localStorage.setItem("taskTexts", JSON.stringify(newGroupTaskTexts));
           localStorage.setItem(
        "dc_dm_cschedules",
        JSON.stringify(newdc_dm_cschedules)
      );
        localStorage.setItem(
        "dm_time_doctor_schedules",
        JSON.stringify(newdm_time_doctor_schedules)
      );
        localStorage.setItem(
        "dm_year_doctor_schedules",
        JSON.stringify(newdm_year_doctor_schedules)
      );
        localStorage.setItem(
        "dc_dm_cschedules_status",
        JSON.stringify(newdc_dm_cschedules_status)
      );
      localStorage.setItem(
        "appointment_types",
        JSON.stringify(newAppointmentTypes)
      );
       localStorage.setItem(
        "userguid_types",
        JSON.stringify(newUserguidTypes)
      );
      localStorage.setItem(
        "categories",
        JSON.stringify(newCategories)
      );
      localStorage.setItem(
        "stepsprocesslead",
        JSON.stringify(newStepProcessLead)
      );
       localStorage.setItem(
        "ads_accounts",
        JSON.stringify(newAdsAccount)
      );
      localStorage.setItem(
        "userTypes",
        JSON.stringify(newUserTypes)
      );
      localStorage.setItem(
        "newFType",
        JSON.stringify(newFType)
      );
      localStorage.setItem(
        "employee_id",
        JSON.stringify(current_user.employee_id)
      );
       localStorage.setItem(
        "team_ids",
        JSON.stringify(current_user.team_ids)
      );
        localStorage.setItem(
        "team_ids",
        JSON.stringify(current_user.team_ids)
      );
      localStorage.setItem(
        "role_user",
        JSON.stringify(current_user.employee_team_id)
      );
       localStorage.setItem(
        "voucher_types",
        JSON.stringify(newVouchersTypes)
      );
        localStorage.setItem(
        "schedule_types",
        JSON.stringify(newcs_schedule_type)
      );
      localStorage.setItem(
        "list_users",
        JSON.stringify(newListUsers)
      );
        localStorage.setItem(
        "campaign_criteria",
        JSON.stringify(newCampaignCriteria)
      );
      localStorage.setItem(
        "listServicesAllowGroup",
        JSON.stringify(listServicesAllowGroup)
      );
      localStorage.setItem("launchSources", JSON.stringify(newLaunchSources));
      localStorage.setItem("TouchPointLogType", JSON.stringify(newTouchPointLogType));
      localStorage.setItem(
        "launchSourcesGroups",
        JSON.stringify(newLaunchSourcesGroups)
      );
    
      localStorage.setItem(
        "launchSourcesTypes",
        JSON.stringify(newLaunchSourcesTypes)
      );
      localStorage.setItem("genders", JSON.stringify(newGenders));
      // localStorage.setItem("packages", JSON.stringify(newPackages));
      localStorage.setItem("user_call_agent", JSON.stringify(phone_config));
      localStorage.setItem("services", JSON.stringify(listServiceConverted));
      localStorage.setItem("tagstype", JSON.stringify(newTagType));
      localStorage.setItem("servicesDefault", JSON.stringify(services));
      localStorage.setItem("dms", "1");

      setTimeout(() => {
        localStorage.setItem("affiliates", JSON.stringify(newAffiliates));
        localStorage.setItem("nations", JSON.stringify(newNations));
        localStorage.setItem("careers", JSON.stringify(newCareers));
        localStorage.setItem("tagsCustomer", JSON.stringify(newTags));
        localStorage.setItem("employeeTeams", JSON.stringify(newEmployeeTeams));
        localStorage.setItem("employeeList", JSON.stringify(users));
        localStorage.setItem("groupTask", JSON.stringify(newGroupTask));
        localStorage.setItem(
          "ListTagPhareTranfer",
          JSON.stringify(ListTagPhareTranfer)
        );
        localStorage.setItem(
          "tags_dropdown",
          JSON.stringify(newTagsMultiSelect)
        );
        localStorage.setItem("listCSKH", JSON.stringify(listCSKH));
      }, 2000);

      $state.dataLaunchSource = newLaunchSources;
    });
    builder.addCase(getListServiceWItems.fulfilled, ($state, action) => {
     const newPackages: DropdownData[] = [];
       action.payload.data.length &&
      action.payload.data.map((item, index) => {
         const convertStages = {
           id: item.package_id,
           label: `${
             item.package_name
           }  (${item.package_prices.toLocaleString("vi-VN")} vnd)`,
           value: item.package_id,
         //  policy_key: item.policy_key,
         };
     
           newPackages.push(convertStages as unknown as DropdownData);
       
      });
      localStorage.setItem(
        "packages",
        JSON.stringify(newPackages)
      );
      localStorage.setItem(
        "packagesItems",
        JSON.stringify(action.payload.data)
      );


      // localStorage.setItem(
      //   "listPharesBeforeExams",
      //   JSON.stringify(listPharesBeforeExams)
      // );


  

    });
  },
});
export const {
  setInfoUserAgent,
  setRoleUser,
  setInforUser,
  setTokenUser,
  setShortName,
} = homeSlice.actions;

export default homeSlice.reducer;
