import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const { SUPABASE_URL, SUPABASE_KEY } = Constants.expoConfig.extra;

if (__DEV__) {
  console.log('__DEV__:', __DEV__);
  console.log('Using Supabase URL:', SUPABASE_URL);
  console.log('Using Supabase Key:', SUPABASE_KEY ? SUPABASE_KEY : 'Not Set');
}

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Missing Supabase URL or Key in environment variables.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);



"groupedItems": [
  {
      "lang": "zh-hant",
      "order": "1",
      "alternate_name": "(Special) Baked Spaghetti Bolognese",
      "name": "芝士焗肉醬意粉",
      "excerpt": "香濃肉醬與牽絲芝士焗烤意大利麵，滿滿幸福滋味。",
      "description": "香濃的肉醬與拉絲的芝士交織在焗烤意大利麵中，帶來無窮的美味。每一口都充滿了幸福的滋味。",
      "non_member_fee_in_cents": 1850,
      "fee_in_cents": 1599,
      "discounted_fee_in_cents": 1407,
      "image_url": "https://res.cloudinary.com/dzkmdkmnf/image/upload/SHFGV1P4R34G1/NCWRFQ5C6Y16E.jpg",
      "categories": [
          "Special Meal",
          "Special Meal (Discount)"
      ],
      "discounted_categories": "Special Meal (Discount)",
      "modifier_groups": [
          {
              "id": "bd666317b7a04cf603c9887e866bcc85",
              "name": "選加西湯",
              "maxAllowed": 1,
              "minRequired": 0,
              "alternate_name": "Add a Soup",
              "is_complimentary": false,
              "modifiers": [
                  {
                      "id": "a78af5c2ce211e916f7784dd73879395",
                      "name": "忌廉湯",
                      "price": 359,
                      "fee_in_cents": 359,
                      "discounted_fee_in_cents": 359,
                      "non_member_fee_in_cents": 359,
                      "alternate_name": "Add Cream Soup",
                      "modifierGroupName": "Add a Soup",
                      "image_url": "https://res.cloudinary.com/dzkmdkmnf/image/upload/c_thumb,w_240,ar_1:1/d_placeholder.png/SHFGV1P4R34G1/H0532FX2R9E3A.webp"
                  },
              ]
          }
      ],
      "tags": [
          ""
      ],
      "variant_group": "",
      "is_available": true,
      "is_hidden": false,
      "gift_per_user": "FALSE",
      "gift_1": false,
      "gift_2": false,
      "gift_3": false,
      "image_cover_url": "https://res.cloudinary.com/dzkmdkmnf/image/upload/d_placeholder-image/c_thumb,w_500,ar_1:1/SHFGV1P4R34G1/NCWRFQ5C6Y16E.webp",
      "image_thumb_url": "https://res.cloudinary.com/dzkmdkmnf/image/upload/d_placeholder-image/c_thumb,w_180,ar_1:1/SHFGV1P4R34G1/NCWRFQ5C6Y16E.webp",
      "id": "bbb731385db4bcb5c681ef17562418aa",
      "gid": "ChIJ946gADB1hlQR0J5c2OYE4ak",
      "items": [],
      "attributes": [],
      "min_max_display": false,
      "min": {
          "fee_min": 0,
          "discounted_min": 0,
          "non_member_fee_min": 0
      },
      "max": {
          "fee_max": 0,
          "discounted_max": 0,
          "non_member_fee_max": 0
      },
      "is_variant": false,
      "direct_add_allowed": false
  },
  {
      "lang": "zh-hant",
      "order": "1",
      "alternate_name": "[PT] Baked Spaghetti Bolognese",
      "name": "[派對]芝士焗肉醬意粉 ",
      "excerpt": "香濃芝士焗意粉，配上濃郁美味的肉醬，滿足味蕾的絕佳選擇。",
      "description": "焗意粉搭配經典肉醬，撒上融化的芝士，讓每一口都更加美味。",
      "non_member_fee_in_cents": 0,
      "fee_in_cents": 0,
      "discounted_fee_in_cents": 0,
      "image_url": "",
      "categories": [
          "Party Tray (Baked Rice/ Spaghetti)"
      ],
      "discounted_categories": "",
      "modifier_groups": [],
      "tags": [
          ""
      ],
      "variant_group": "[PT] Baked Spaghetti Bolognese",
      "is_available": true,
      "is_hidden": false,
      "gift_per_user": "FALSE",
      "gift_1": false,
      "gift_2": false,
      "gift_3": false,
      "image_cover_url": "",
      "image_thumb_url": "",
      "id": "54e5b355aad9bd5baf17293db2ddc501",
      "gid": "ChIJ946gADB1hlQR0J5c2OYE4ak",
      "items": [
          {
              "lang": "zh-hant",
              "order": "1",
              "alternate_name": "[PT] Baked Spaghetti Bolognese (Medium)",
              "name": "[派對]芝士焗肉醬意粉 (中)",
              "printer_name": "[派對]芝士焗肉醬意粉 (中)",
              "excerpt": "",
              "description": "",
              "non_member_fee_in_cents": 16000,
              "fee_in_cents": 13900,
              "discounted_fee_in_cents": 13900,
              "image_url": "",
              "categories": [
                  "Party Tray (Baked Rice/ Spaghetti)"
              ],
              "discounted_categories": "",
              "modifier_groups": [],
              "tags": [
                  ""
              ],
              "variant_group": "[PT] Baked Spaghetti Bolognese",
              "variants": "份量",
              "options": [
                  {
                      "id": "15ecbe0b22befeff75c9d797c66d223f",
                      "name": "#3#中 (12-14人)",
                      "alternate_name": "#3#中 (12-14人)"
                  }
              ],
              "is_available": true,
              "is_hidden": false,
              "gift_per_user": "FALSE",
              "gift_1": false,
              "gift_2": false,
              "gift_3": false,
              "image_cover_url": "https://res.cloudinary.com/dzkmdkmnf/image/upload/c_thumb,w_240,ar_1:1/d_placeholder.png/SHFGV1P4R34G1/H0532FX2R9E3A.webp",
              "image_thumb_url": "https://res.cloudinary.com/dzkmdkmnf/image/upload/c_thumb,w_240,ar_1:1/d_placeholder.png/SHFGV1P4R34G1/H0532FX2R9E3A.webp",
              "id": "69d2928094091c8f34c64e20eb3385e0",
              "is_discounted": false,
              "discounted_by_cents": 0,
              "members_savings": -2100,
              "attributes": [
                  {
                      "id": "ad11c12f35fb9c5db7d22aef3426e06b",
                      "name": "份量",
                      "alternate_name": "份量",
                      "order": 9999,
                      "options": [
                          {
                              "id": "51d9f7af5574110a48a88445fb30fe02",
                              "name": "迷你 (4-5人)",
                              "alternate_name": "迷你 (4-5人)",
                              "order": 1
                          },
                          {
                              "id": "6e87631e7a426276857675d5e8edb2fb",
                              "name": "小 (8-9人)",
                              "alternate_name": "小 (8-9人)",
                              "order": 2
                          },
                          {
                              "id": "15ecbe0b22befeff75c9d797c66d223f",
                              "name": "中 (12-14人)",
                              "alternate_name": "中 (12-14人)",
                              "order": 3
                          }
                      ]
                  }
              ]
          },
          {
              "lang": "zh-hant",
              "order": "1",
              "alternate_name": "[PT] Baked Spaghetti Bolognese (Mini)",
              "name": "[派對]芝士焗肉醬意粉 (迷你)",
              "printer_name": "[派對]芝士焗肉醬意粉 (迷你)",
              "excerpt": "",
              "description": "",
              "non_member_fee_in_cents": 6800,
              "fee_in_cents": 5900,
              "discounted_fee_in_cents": 5900,
              "image_url": "",
              "categories": [
                  "Party Tray (Baked Rice/ Spaghetti)"
              ],
              "discounted_categories": "",
              "modifier_groups": [],
              "tags": [
                  ""
              ],
              "variant_group": "[PT] Baked Spaghetti Bolognese",
              "variants": "份量",
              "options": [
                  {
                      "id": "51d9f7af5574110a48a88445fb30fe02",
                      "name": "#1#迷你 (4-5人)",
                      "alternate_name": "#1#迷你 (4-5人)"
                  }
              ],
              "is_available": true,
              "is_hidden": false,
              "gift_per_user": "FALSE",
              "gift_1": false,
              "gift_2": false,
              "gift_3": false,
              "image_cover_url": "https://res.cloudinary.com/dzkmdkmnf/image/upload/c_thumb,w_240,ar_1:1/d_placeholder.png/SHFGV1P4R34G1/H0532FX2R9E3A.webp",
              "image_thumb_url": "https://res.cloudinary.com/dzkmdkmnf/image/upload/c_thumb,w_240,ar_1:1/d_placeholder.png/SHFGV1P4R34G1/H0532FX2R9E3A.webp",
              "id": "0e13be919697dd0c9d6030b1fe422c42",
              "is_discounted": false,
              "discounted_by_cents": 0,
              "members_savings": -900,
              "attributes": [
                  {
                      "id": "ad11c12f35fb9c5db7d22aef3426e06b",
                      "name": "份量",
                      "alternate_name": "份量",
                      "order": 9999,
                      "options": [
                          {
                              "id": "51d9f7af5574110a48a88445fb30fe02",
                              "name": "迷你 (4-5人)",
                              "alternate_name": "迷你 (4-5人)",
                              "order": 1
                          },
                          {
                              "id": "6e87631e7a426276857675d5e8edb2fb",
                              "name": "小 (8-9人)",
                              "alternate_name": "小 (8-9人)",
                              "order": 2
                          },
                          {
                              "id": "15ecbe0b22befeff75c9d797c66d223f",
                              "name": "中 (12-14人)",
                              "alternate_name": "中 (12-14人)",
                              "order": 3
                          }
                      ]
                  }
              ]
          },
          {
              "lang": "zh-hant",
              "order": "1",
              "alternate_name": "[PT] Baked Spaghetti Bolognese (Small)",
              "name": "[派對]芝士焗肉醬意粉 (小)",
              "printer_name": "[派對]芝士焗肉醬意粉 (小)",
              "excerpt": "",
              "description": "",
              "non_member_fee_in_cents": 9100,
              "fee_in_cents": 7900,
              "discounted_fee_in_cents": 7900,
              "image_url": "",
              "categories": [
                  "Party Tray (Baked Rice/ Spaghetti)"
              ],
              "discounted_categories": "",
              "modifier_groups": [],
              "tags": [
                  ""
              ],
              "variant_group": "[PT] Baked Spaghetti Bolognese",
              "variants": "份量",
              "options": [
                  {
                      "id": "6e87631e7a426276857675d5e8edb2fb",
                      "name": "#2# 小 (8-9人)",
                      "alternate_name": "#2# 小 (8-9人)"
                  }
              ],
              "is_available": true,
              "is_hidden": false,
              "gift_per_user": "FALSE",
              "gift_1": false,
              "gift_2": false,
              "gift_3": false,
              "image_cover_url": "https://res.cloudinary.com/dzkmdkmnf/image/upload/c_thumb,w_240,ar_1:1/d_placeholder.png/SHFGV1P4R34G1/H0532FX2R9E3A.webp",
              "image_thumb_url": "https://res.cloudinary.com/dzkmdkmnf/image/upload/c_thumb,w_240,ar_1:1/d_placeholder.png/SHFGV1P4R34G1/H0532FX2R9E3A.webp",
              "id": "07b9bea09138623fc5423877b3ed4de2",
              "is_discounted": false,
              "discounted_by_cents": 0,
              "members_savings": -1200,
              "attributes": [
                  {
                      "id": "ad11c12f35fb9c5db7d22aef3426e06b",
                      "name": "份量",
                      "alternate_name": "份量",
                      "order": 9999,
                      "options": [
                          {
                              "id": "51d9f7af5574110a48a88445fb30fe02",
                              "name": "迷你 (4-5人)",
                              "alternate_name": "迷你 (4-5人)",
                              "order": 1
                          },
                          {
                              "id": "6e87631e7a426276857675d5e8edb2fb",
                              "name": "小 (8-9人)",
                              "alternate_name": "小 (8-9人)",
                              "order": 2
                          },
                          {
                              "id": "15ecbe0b22befeff75c9d797c66d223f",
                              "name": "中 (12-14人)",
                              "alternate_name": "中 (12-14人)",
                              "order": 3
                          }
                      ]
                  }
              ]
          }
      ],
      "attributes": [
          {
              "id": "ad11c12f35fb9c5db7d22aef3426e06b",
              "name": "份量",
              "alternate_name": "份量",
              "order": 9999,
              "options": [
                  {
                      "id": "51d9f7af5574110a48a88445fb30fe02",
                      "name": "迷你 (4-5人)",
                      "alternate_name": "迷你 (4-5人)",
                      "order": 1
                  },
                  {
                      "id": "6e87631e7a426276857675d5e8edb2fb",
                      "name": "小 (8-9人)",
                      "alternate_name": "小 (8-9人)",
                      "order": 2
                  },
                  {
                      "id": "15ecbe0b22befeff75c9d797c66d223f",
                      "name": "中 (12-14人)",
                      "alternate_name": "中 (12-14人)",
                      "order": 3
                  }
              ]
          }
      ],
      "min_max_display": true,
      "min": {
          "fee_min": 5900,
          "discounted_min": 5900,
          "non_member_fee_min": 6800
      },
      "max": {
          "fee_max": 13900,
          "discounted_max": 13900,
          "non_member_fee_max": 16000
      },
      "is_variant": false,
      "direct_add_allowed": false
  },
  {
      "lang": "zh-hant",
      "order": "1",
      "alternate_name": "[PT] Baked Spaghetti Bolognese (Medium)",
      "name": "[派對]芝士焗肉醬意粉 (中)",
      "excerpt": "",
      "description": "",
      "non_member_fee_in_cents": 16000,
      "fee_in_cents": 13900,
      "discounted_fee_in_cents": 13900,
      "image_url": "",
      "categories": [
          "Party Tray (Baked Rice/ Spaghetti)"
      ],
      "discounted_categories": "",
      "modifier_groups": [],
      "tags": [
          ""
      ],
      "variant_group": "[PT] Baked Spaghetti Bolognese",
      "is_available": true,
      "is_hidden": false,
      "gift_per_user": "FALSE",
      "gift_1": false,
      "gift_2": false,
      "gift_3": false,
      "image_cover_url": "",
      "image_thumb_url": "",
      "id": "69d2928094091c8f34c64e20eb3385e0",
      "gid": "ChIJ946gADB1hlQR0J5c2OYE4ak",
      "items": [],
      "attributes": [],
      "min_max_display": false,
      "min": {
          "fee_min": 0,
          "discounted_min": 0,
          "non_member_fee_min": 0
      },
      "max": {
          "fee_max": 0,
          "discounted_max": 0,
          "non_member_fee_max": 0
      },
      "is_variant": true,
      "direct_add_allowed": true
  },
  {
      "lang": "zh-hant",
      "order": "1",
      "alternate_name": "[PT] Baked Spaghetti Bolognese (Mini)",
      "name": "[派對]芝士焗肉醬意粉 (迷你)",
      "excerpt": "",
      "description": "",
      "non_member_fee_in_cents": 6800,
      "fee_in_cents": 5900,
      "discounted_fee_in_cents": 5900,
      "image_url": "",
      "categories": [
          "Party Tray (Baked Rice/ Spaghetti)"
      ],
      "discounted_categories": "",
      "modifier_groups": [],
      "tags": [
          ""
      ],
      "variant_group": "[PT] Baked Spaghetti Bolognese",
      "is_available": true,
      "is_hidden": false,
      "gift_per_user": "FALSE",
      "gift_1": false,
      "gift_2": false,
      "gift_3": false,
      "image_cover_url": "",
      "image_thumb_url": "",
      "id": "0e13be919697dd0c9d6030b1fe422c42",
      "gid": "ChIJ946gADB1hlQR0J5c2OYE4ak",
      "items": [],
      "attributes": [],
      "min_max_display": false,
      "min": {
          "fee_min": 0,
          "discounted_min": 0,
          "non_member_fee_min": 0
      },
      "max": {
          "fee_max": 0,
          "discounted_max": 0,
          "non_member_fee_max": 0
      },
      "is_variant": true,
      "direct_add_allowed": true
  },
  {
      "lang": "zh-hant",
      "order": "1",
      "alternate_name": "[PT] Baked Spaghetti Bolognese (Small)",
      "name": "[派對]芝士焗肉醬意粉 (小)",
      "excerpt": "",
      "description": "",
      "non_member_fee_in_cents": 9100,
      "fee_in_cents": 7900,
      "discounted_fee_in_cents": 7900,
      "image_url": "",
      "categories": [
          "Party Tray (Baked Rice/ Spaghetti)"
      ],
      "discounted_categories": "",
      "modifier_groups": [],
      "tags": [
          ""
      ],
      "variant_group": "[PT] Baked Spaghetti Bolognese",
      "is_available": true,
      "is_hidden": false,
      "gift_per_user": "FALSE",
      "gift_1": false,
      "gift_2": false,
      "gift_3": false,
      "image_cover_url": "",
      "image_thumb_url": "",
      "id": "07b9bea09138623fc5423877b3ed4de2",
      "gid": "ChIJ946gADB1hlQR0J5c2OYE4ak",
      "items": [],
      "attributes": [],
      "min_max_display": false,
      "min": {
          "fee_min": 0,
          "discounted_min": 0,
          "non_member_fee_min": 0
      },
      "max": {
          "fee_max": 0,
          "discounted_max": 0,
          "non_member_fee_max": 0
      },
      "is_variant": true,
      "direct_add_allowed": true
  },