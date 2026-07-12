/* Hanam BBQ Tây Hồ — menu data (v2)
 * Source of truth: docs/superpowers/specs/menu-v2-update.md §1–§5.
 * Prices are the real Tây Hồ branch prices, format "700,000 VND".
 * main = pork(7) → beef(2) → combo(2), IN THAT ORDER. side = 9. alcohol = 5 (no img).
 * Korean original kept as secondary label.
 * TODO(review): VN native check — vi/en name/desc are draft translations.
 */
window.MENU = {
  main: [
    /* ---------- Pork (7) ---------- */
    {
      group: "pork",
      id: "modum-hanpan",
      ko: "모둠한판",
      img: "assets/img/hanam-cut-a.jpg",
      price: "700,000 VND",
      name: { vi: "Set thịt nướng thập cẩm", en: "Combo Grill Platter" }
    },
    {
      group: "pork",
      id: "teukbyeol-hanpan",
      ko: "특별한판",
      img: "assets/img/hanam-cut-b.jpg",
      price: "1,000,000 VND",
      name: { vi: "Set nướng đặc biệt", en: "Special Grill Platter" }
    },
    {
      group: "pork",
      id: "saengsamgyeopsal",
      ko: "생삼겹살",
      img: "assets/img/hanam-cut-c.jpg",
      price: "250,000 VND",
      name: { vi: "Ba chỉ heo tươi", en: "Fresh Pork Belly" }
    },
    {
      group: "pork",
      id: "teukmoksal",
      ko: "특목살",
      img: "assets/img/hanam-cut-d.jpg",
      price: "250,000 VND",
      name: { vi: "Thịt nạc vai đặc biệt", en: "Premium Pork Collar" }
    },
    {
      group: "pork",
      id: "galmaegisal",
      ko: "갈매기살",
      img: "assets/img/hanam-cut-f.jpg",
      price: "270,000 VND",
      name: { vi: "Thịt cơ hoành heo", en: "Pork Skirt Meat" }
    },
    {
      group: "pork",
      id: "hangjeongsal",
      ko: "항정살",
      img: "assets/img/hanam-cut-g.jpg",
      price: "270,000 VND",
      name: { vi: "Thịt má heo", en: "Pork Jowl (Presa)" }
    },
    {
      group: "pork",
      id: "gabrisal",
      ko: "가브리살",
      img: "assets/img/hanam-cut-h.jpg",
      price: "270,000 VND",
      name: { vi: "Thịt nạc dày", en: "Pork Collar Cap (Pluma)" }
    },

    /* ---------- Beef / Wagyu (2) ---------- */
    {
      group: "beef",
      id: "wagyu-salchisal",
      ko: "와규 살치살 A5",
      img: "assets/img/beef-salchisal.jpg",
      price: "800,000 VND",
      name: { vi: "Bẹ vai Wagyu A5 (130g)", en: "Wagyu Chuck Flap Tail A5 (130g)" },
      desc: {
        vi: "Bẹ vai Wagyu A5 — thớ săn mà mềm, vân mỡ tinh tế, thơm đậm khi nướng.",
        en: "Wagyu A5 chuck flap tail — firm yet tender, delicate marbling, rich aroma when grilled."
      }
    },
    {
      group: "beef",
      id: "wagyu-combo",
      ko: "와규 콤보",
      img: "assets/img/beef-wagyu-combo.jpg",
      price: "2,600,000 VND",
      name: { vi: "Combo Wagyu", en: "Wagyu Combo" },
      desc: {
        vi: "Thăn hoa + Thăn ngoại + Bẹ vai Wagyu A5 (130g mỗi loại) + 1 canh tùy chọn + trứng hấp trứng cá chuồn.",
        en: "Wagyu Ribeye + Striploin + Chuck Flap Tail A5 (130g each) + 1 stew + steamed egg with flying-fish roe."
      }
    },

    /* ---------- Combo / Lunch Set (2, last) ---------- */
    {
      group: "combo",
      id: "moksal-set",
      ko: "양념목살갈비 세트",
      img: "assets/img/combo-moksal.jpg",
      price: "200,000 VND",
      name: { vi: "Set trưa Nạc Sườn Vai Sốt Tương", en: "Marinated Pork Neck Lunch Set" },
      desc: {
        vi: "COMBO A: nạc sườn vai sốt tương + mì lạnh nước hoặc mì lạnh trộn.\nCOMBO B: nạc sườn vai + canh tương đậu (nhỏ) + cơm trắng.\nThêm trứng hấp +50,000 VND.",
        en: "COMBO A: marinated pork neck + cold or spicy buckwheat noodle.\nCOMBO B: marinated pork neck + soybean-paste stew (small) + steamed rice.\nAdd steamed egg +50,000 VND."
      }
    },
    {
      group: "combo",
      id: "jeyuk-set",
      ko: "제육볶음 세트",
      img: "assets/img/combo-jeyuk.jpg",
      price: "200,000 VND",
      name: { vi: "Set trưa Thịt Heo Xào Cay", en: "Spicy Stir-fried Pork Lunch Set" },
      desc: {
        vi: "COMBO A: thịt heo xào cay + mì lạnh nước hoặc mì lạnh trộn.\nCOMBO B: thịt heo xào cay + canh tương đậu (nhỏ) + cơm trắng.\nThêm trứng hấp +50,000 VND.",
        en: "COMBO A: spicy stir-fried pork + cold or spicy buckwheat noodle.\nCOMBO B: spicy stir-fried pork + soybean-paste stew (small) + steamed rice.\nAdd steamed egg +50,000 VND."
      }
    }
  ],

  side: [
    {
      id: "kimchi-stew",
      ko: "돼지고기 김치찌개",
      img: "assets/img/side-kimchi-stew.jpg",
      price: "200,000 VND",
      name: { vi: "Canh kimchi thịt heo", en: "Pork Kimchi Stew" }
    },
    {
      id: "doenjang-stew",
      ko: "된장찌개",
      img: "assets/img/side-doenjang-stew.jpg",
      price: "200,000 VND",
      name: { vi: "Canh tương đậu", en: "Soybean Paste Stew" }
    },
    {
      id: "gochujang-stew",
      ko: "고추장찌개",
      img: "assets/img/side-gochujang-stew.jpg",
      price: "200,000 VND",
      name: { vi: "Canh tương ớt", en: "Gochujang Stew" }
    },
    {
      id: "mul-naengmyeon",
      ko: "물냉면",
      img: "assets/img/side-mul-naengmyeon.jpg",
      price: "150,000 VND",
      name: { vi: "Mì lạnh nước", en: "Cold Buckwheat Noodle Soup" }
    },
    {
      id: "bibim-naengmyeon",
      ko: "비빔냉면",
      img: "assets/img/side-hoe-naengmyeon.jpg",
      price: "150,000 VND",
      name: { vi: "Mì lạnh trộn cay", en: "Spicy Cold Noodles" }
    },
    {
      id: "janchi-guksu",
      ko: "잔치국수",
      img: "assets/img/side-janchi-guksu.jpg",
      price: "140,000 VND",
      name: { vi: "Mì nước truyền thống", en: "Banquet Noodle Soup" }
    },
    {
      id: "kimchi-noodles",
      ko: "김치말이국수",
      img: "assets/img/side-kimchi-noodles.jpg",
      price: "140,000 VND",
      name: { vi: "Mì cuốn kimchi", en: "Kimchi Somen Noodles" }
    },
    {
      id: "steamed-egg",
      ko: "계란찜",
      img: "assets/img/side-steamed-egg.jpg",
      price: "90,000 VND",
      name: { vi: "Trứng hấp", en: "Steamed Egg" }
    },
    {
      id: "kimchi-fried-rice",
      ko: "도시락 김치볶음밥",
      img: "assets/img/side-kimchi-fried-rice.jpg",
      price: "130,000 VND",
      name: { vi: "Cơm rang kimchi", en: "Kimchi Fried Rice" }
    }
  ],

  alcohol: [
    /* ---------- Soju (3) ---------- */
    {
      group: "soju",
      ko: "참이슬 · 처음처럼 · 진로이즈백",
      price: "160,000 VND",
      name: { vi: "Chamisul, Chum Churum, Jinro", en: "Chamisul, Chum Churum, Jinro" }
    },
    {
      group: "soju",
      ko: "새로 · 새로 리치맛(무설탕)",
      price: "160,000 VND",
      name: { vi: "Saero, Saero Lychee (Zero Sugar)", en: "Saero, Saero Lychee (Zero Sugar)" }
    },
    {
      group: "soju",
      ko: "참이슬 (청포도 · 복숭아 · 자몽)",
      price: "160,000 VND",
      name: { vi: "Chamisul (Green Grape, Peach, Grapefruit)", en: "Chamisul (Green Grape, Peach, Grapefruit)" }
    },

    /* ---------- Beer (2) ---------- */
    {
      group: "beer",
      ko: "타이거 크리스탈 · 하이네켄",
      price: "50,000 VND",
      name: { vi: "Tiger Crystal, Heineken", en: "Tiger Crystal, Heineken" }
    },
    {
      group: "beer",
      ko: "칼스버그 · 블랑 (330ml)",
      price: "70,000 VND",
      name: { vi: "Carlsberg Draft, Blanc Draft (330ml)", en: "Carlsberg Draft, Blanc Draft (330ml)" }
    }
  ]
};
