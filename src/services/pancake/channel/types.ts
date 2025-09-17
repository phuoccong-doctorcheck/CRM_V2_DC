export interface ListPages {
  categorized?: Categorized;
  success?: boolean;
}

export interface Categorized {
  activated?: PageActivated[];
  activated_page_ids?: string[];
  inactivated?: any[];
}

export interface PageActivated {
  business?: null;
  connected?: boolean;
  custom_page_color?: null;
  id?: string;
  is_activated?: boolean;
  is_silhouette?: boolean;
  last_global_id_crawl?: null;
  name?: string;
  need_fix_webhook?: null;
  page_content_sync_group_id?: null;
  permissions?: Permissions;
  platform?: string;
  platform_extra_info?: PlatformExtraInfo;
  role_in_page?: string;
  settings?: Settings;
  shop_id?: number;
  special_feature?: boolean;
  timezone?: number;
  username?: null | string;
  users?: User[];
}

export interface Permissions {
  is_enabled_permissions?: boolean;
  permissions?: string[];
}

export interface PlatformExtraInfo {
  connected?: boolean;
  logout?: boolean;
  inbox_spam_synced_at?: Date;
}

export interface Settings {
  hard_round_robin_assign_to_other_user_online?: boolean;
  show_assigned?: boolean;
  filter_multi_tag?: string;
  hide_botcake_reply_notification?: boolean;
  unread_first?: boolean;
  allow_round_robin?: boolean;
  hard_round_robin_show_all_convs_if_user_not_in_list?: boolean;
  hard_round_robin_only_assign_to_online_user?: boolean;
  hard_round_robin_priority_online?: boolean;
  elastic_index_version?: ElasticIndexVersion;
  hard_round_robin?: boolean;
  auto_unhide_comment_after?: number;
  auto_like?: boolean;
  hard_round_robin_groups?: HardRoundRobinGroup[];
  auto_unhide_comment?: boolean;
  auto_create_order?: boolean;
  multi_tag?: boolean;
  full_tag?: boolean;
  hard_round_robin_inbox_user_ids?: any[];
  show_quick_reply_topics?: boolean;
  current_settings_key?: string;
  hard_round_robin_group_next_id?: number;
  hard_round_robin_web_user_ids?: any[];
  notification?: boolean;
  qr_autocomplete?: boolean;
  hard_round_robin_reassign_if_unread_after_x_min?: number;
  sync_tag_to_botcake?: boolean;
  hard_round_robin_group_mode?: boolean;
  staff_detail?: StaffDetail[];
  hard_round_robin_tmp_ignore_user_ids?: any[];
  auto_hide_comment?: string;
  current_tag_index?: number;
  hard_round_robin_working_time_value?: number[];
  hard_round_robin_comment_user_ids?: any[];
  self_assignment_round_robin?: boolean;
  hard_round_robin_removed_groups?: any[];
  auto_tagging?: boolean;
  auto_like_friend_tag_comment?: boolean;
  page_access_token?: null;
  anti_spam?: boolean;
  keep_conv_state_if_sticker?: boolean;
  friend_tag_notification?: string;
  show_viewing_conv_in_list?: boolean;
  auto_detect_birthday?: boolean;
}

export interface ElasticIndexVersion {
  conversation?: number;
  conversation_note?: number;
  message?: number;
  page_customer?: number;
}

export interface HardRoundRobinGroup {
  id?: string;
  name?: string;
  user_ids?: any[];
}

export interface StaffDetail {
  content?: string;
  fb_id?: string;
  name?: string;
  user_id?: string;
}

export interface User {
  fb_id?: string;
  name?: string;
  page_id?: string;
  status?: string;
  user_id?: string;
}

/* Conversation */

export interface RespConversation {
  conversations: ConversationItem[];
}

export interface ConversationItem {
  ad_ids: string[];
  ads: Ad[];
  assignee_histories: any[];
  current_assign_users: any[];
  customer_id: string;
  customers: Customer[];
  from: From;
  has_phone: boolean;
  id: string;
  inserted_at: Date;
  last_sent_by: From;
  message_count: number;
  page_customer: PageCustomer;
  page_id: string;
  post_id: null;
  recent_phone_numbers: any[];
  tag_histories: any[];
  tags: any[];
  type: string;
  updated_at: Date;
  seen: boolean;
  snippet: string;
}

export interface Ad {
  ad_id: string;
  inserted_at: Date;
  post_id: string;
}

export interface Customer {
  fb_id: string;
  id: string;
  name: string;
}

export interface From {
  admin_id: string;
  admin_name: string;
  email: string;
  id: string;
  name: string;
}

export interface PageCustomer {
  birthday: null;
  customer_id: string;
  gender: string;
  global_id: null;
  id: string;
  inserted_at: Date;
  name: string;
  notes: null;
  psid: string;
  recent_orders: null;
}

/* List Tag */

export interface RespListTag {
  tags: TagItem[];
}

export interface TagItem {
  color: string;
  id: number;
  lighten_color: string;
  text: string;
}

/* Message */

export interface RespMessage {
  activities: any[];
  ad_clicks: AdClicks;
  app: string;
  available_for_report_phone_numbers: any[];
  banned_by: null;
  banned_count: number;
  birthday: null;
  can_inbox: boolean;
  comment_count: number;
  conv_phone_numbers: any[];
  conversation_id: string;
  customers: CustomerMessage[];
  gender: string;
  global_id: null;
  global_user_id: null;
  is_banned: boolean;
  last_commented_at: boolean;
  lives_in: null;
  matched_wa_fb_customers: null;
  messages: Message[];
  notes: null;
  post: null;
  profile_updated_at: null;
  read_watermarks: ReadWatermark[];
  recent_orders: any[];
  recent_phone_numbers: any[];
  reported_count: number;
  reports_by_phone: any;
  shopee_offer_unreply_count: number;
  success: boolean;
}

export interface AdClicks {
  [x: string]: any;
}

export interface CustomerMessage {
  ad_clicks: any[];
  address_source: any[];
  fb_id: string;
  global_id: null;
  id: string;
  is_followed: null;
  name: string;
  personal_info: PersonalInfo;
  web_sources: any[];
}

export interface PersonalInfo {
  gender: string;
}

export interface Message {
  attachments: any[];
  can_comment: boolean;
  can_hide: boolean;
  can_like: boolean;
  can_remove: boolean;
  can_reply_privately: boolean;
  comment_count: null;
  conversation_id: string;
  edit_history: null;
  from: From;
  has_phone: boolean;
  id: string;
  inserted_at: Date;
  is_hidden: boolean;
  is_livestream_order: null;
  is_parent: boolean;
  is_parent_hidden: boolean;
  is_removed: boolean;
  like_count: null;
  message: string;
  message_tags: any[];
  original_message: string;
  page_id: string;
  parent_id: null;
  phone_info: any[];
  private_reply_conversation: null;
  removed_by: null;
  rich_message: null;
  seen: boolean;
  show_info: boolean;
  type: string;
  user_likes: boolean;
}

export interface FromMessageInfo {
  email?: string;
  id: string;
  name: string;
  admin_id?: string;
  admin_name?: string;
}

export interface ReadWatermark {
  is_group_conv: null;
  message_id: string;
  psid: string;
  watermark: number;
}

export interface StatisticUserResponse {
  data: DataUser;
  success: boolean;
}

export interface DataUser {
  statistics: { [key: string]: statisticUserItem[] };
  users: { [key: string]: any };
}

export interface statisticUserItem {
  average_response_time: number;
  comment_count: number;
  hour: Date;
  hour_in_integer: string;
  inbox_count: number;
  order_count: number;
  page_id: string;
  phone_number_count: number;
  private_reply_count: number;
  unique_comment_count: number;
  unique_inbox_count: number;
  user_fb_id?: string;
  user_name?: string;
}
