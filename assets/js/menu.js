/* Hanam BBQ Tây Hồ — menu data (Main 10 + Side 9, 19 items total)
 * Source of truth: docs/superpowers/specs/source-content.md § C-REVISED.
 * Korean original kept as secondary label. vi/en names + short appetizing descriptions.
 * TODO(review): VN native check — all name/desc are draft translations.
 */
window.MENU = {
  main: [
    {
      id: "modum-hanpan",
      ko: "모둠한판",
      img: "assets/img/hanam-cut-a.jpg",
      name: { vi: "Set thịt nướng thập cẩm", en: "Combo Grill Platter" },
      desc: {
        vi: "Đủ vị heo tươi trên một mâm, chọn 1 lần nếm trọn tinh hoa.",
        en: "A full sampler of fresh cuts — every signature flavor on one plate."
      }
    },
    {
      id: "teukbyeol-hanpan",
      ko: "특별한판",
      img: "assets/img/hanam-cut-b.jpg",
      name: { vi: "Set nướng đặc biệt", en: "Special Grill Platter" },
      desc: {
        vi: "Set nướng cao cấp, hội tụ những phần thịt quý hiếm nhất.",
        en: "Our premium platter, gathering the rarest cuts of the house."
      }
    },
    {
      id: "saengsamgyeopsal",
      ko: "생삼겹살",
      img: "assets/img/hanam-cut-c.jpg",
      name: { vi: "Ba chỉ heo tươi", en: "Fresh Pork Belly" },
      desc: {
        vi: "Ba chỉ tươi nguyên miếng, nướng vàng giòn rìa, mọng nước bên trong.",
        en: "Whole fresh pork belly, grilled to a crisp golden edge and juicy center."
      }
    },
    {
      id: "teukmoksal",
      ko: "특목살",
      img: "assets/img/hanam-cut-d.jpg",
      name: { vi: "Thịt nạc vai đặc biệt", en: "Premium Pork Collar" },
      desc: {
        vi: "Phần nạc vai tuyển chọn, thớ thịt mềm ngọt, ít mỡ.",
        en: "Select pork collar — tender, sweet grain with little fat."
      }
    },
    {
      id: "saenggalbi",
      ko: "생갈비",
      img: "assets/img/hanam-cut-e.jpg",
      name: { vi: "Sườn heo tươi", en: "Fresh Pork Ribs" },
      desc: {
        vi: "Sườn heo tươi bám xương, đậm vị và mọng nước khi nướng.",
        en: "Fresh bone-in pork ribs, rich and juicy off the grill."
      }
    },
    {
      id: "galmaegisal",
      ko: "갈매기살",
      img: "assets/img/hanam-cut-f.jpg",
      name: { vi: "Thịt cơ hoành heo", en: "Pork Skirt Meat" },
      desc: {
        vi: "Phần cơ hoành hiếm, dai giòn sần sật, càng nhai càng ngọt.",
        en: "A rare skirt cut — springy bite that grows sweeter as you chew."
      }
    },
    {
      id: "hangjeongsal",
      ko: "항정살",
      img: "assets/img/hanam-cut-g.jpg",
      name: { vi: "Thịt má heo (nọng)", en: "Pork Jowl (Presa)" },
      desc: {
        vi: "Má heo vân mỡ đẹp, béo mềm tan trong miệng.",
        en: "Beautifully marbled jowl — buttery and melt-in-the-mouth."
      }
    },
    {
      id: "gabrisal",
      ko: "가브리살",
      img: "assets/img/hanam-cut-h.jpg",
      name: { vi: "Thịt nạc dày (gáy heo)", en: "Pork Collar Cap (Pluma)" },
      desc: {
        vi: "Phần nạc dày quý, mềm mọng với lớp mỡ mỏng cân bằng.",
        en: "A prized thick cut — tender and juicy with a fine balancing fat."
      }
    },
    {
      id: "ogyeopsal",
      ko: "한돈숙성 오겹살",
      img: "assets/img/hanam-cut-i.jpg",
      name: { vi: "Ba chỉ 5 lớp ủ vị Hàn Quốc", en: "Aged Korean Pork Belly (5-layer)" },
      desc: {
        vi: "Ba chỉ 5 lớp heo Hàn ủ vị, đậm đà và thơm sâu.",
        en: "Five-layer aged Korean pork belly — deep, savory, aromatic."
      }
    },
    {
      id: "makchang",
      ko: "막창구이",
      img: "assets/img/hanam-cut-j.jpg",
      name: { vi: "Lòng heo nướng", en: "Grilled Pork Intestine" },
      desc: {
        vi: "Lòng heo làm sạch kỹ, nướng giòn thơm, béo bùi đặc trưng.",
        en: "Carefully cleaned pork intestine, grilled crisp with a rich, savory chew."
      }
    }
  ],
  side: [
    {
      id: "kimchi-fried-rice",
      ko: "도시락 김치볶음밥",
      img: "assets/img/side-kimchi-fried-rice.jpg",
      name: { vi: "Cơm rang kimchi (hộp lắc)", en: "Kimchi Fried Rice (shake lunchbox)" },
      desc: {
        vi: "Cơm rang kimchi lắc đều trong hộp, thơm cay tròn vị.",
        en: "Shaken lunchbox-style kimchi fried rice, smoky and full of flavor."
      }
    },
    {
      id: "kimchi-stew",
      ko: "한돈 김치찌개",
      img: "assets/img/side-kimchi-stew.jpg",
      name: { vi: "Canh kimchi thịt heo", en: "Korean Pork Kimchi Stew" },
      desc: {
        vi: "Canh kimchi cay nồng nấu cùng thịt heo Hàn, ấm bụng.",
        en: "Spicy kimchi stew simmered with Korean pork, warm and hearty."
      }
    },
    {
      id: "gochujang-stew",
      ko: "한돈 고추장찌개",
      img: "assets/img/side-gochujang-stew.jpg",
      name: { vi: "Canh tương ớt thịt heo", en: "Korean Pork Gochujang Stew" },
      desc: {
        vi: "Canh tương ớt đậm đà, cay dịu, nấu cùng thịt heo Hàn.",
        en: "A rich, gently spicy gochujang stew simmered with Korean pork."
      }
    },
    {
      id: "doenjang-stew",
      ko: "우삼겹 된장찌개",
      img: "assets/img/side-doenjang-stew.jpg",
      name: { vi: "Canh tương đậu ba chỉ bò", en: "Beef Brisket Doenjang Stew" },
      desc: {
        vi: "Canh tương đậu truyền thống nấu cùng ba chỉ bò mềm.",
        en: "Traditional soybean-paste stew with tender beef brisket."
      }
    },
    {
      id: "steamed-egg",
      ko: "날치알 계란찜",
      img: "assets/img/side-steamed-egg.jpg",
      name: { vi: "Trứng hấp trứng cá chuồn", en: "Steamed Egg w/ Flying-fish Roe" },
      desc: {
        vi: "Trứng hấp mềm mịn, điểm xuyết trứng cá chuồn giòn tan.",
        en: "Silky steamed egg dotted with crunchy flying-fish roe."
      }
    },
    {
      id: "mul-naengmyeon",
      ko: "물냉면",
      img: "assets/img/side-mul-naengmyeon.jpg",
      name: { vi: "Mì lạnh nước (Mul-naengmyeon)", en: "Cold Buckwheat Noodle Soup" },
      desc: {
        vi: "Mì kiều mạch mát lạnh trong nước dùng thanh, giải nhiệt tức thì.",
        en: "Chilled buckwheat noodles in a clean, cool broth."
      }
    },
    {
      id: "hoe-naengmyeon",
      ko: "코다리 회냉면",
      img: "assets/img/side-hoe-naengmyeon.jpg",
      name: { vi: "Mì lạnh trộn cay cá minh thái", en: "Spicy Cold Noodles w/ Half-dried Pollack" },
      desc: {
        vi: "Mì trộn cay the cùng cá minh thái bán khô, đậm đà khó quên.",
        en: "Spicy cold noodles tossed with half-dried pollack, bold and memorable."
      }
    },
    {
      id: "kimchi-noodles",
      ko: "김치말이국수",
      img: "assets/img/side-kimchi-noodles.jpg",
      name: { vi: "Mì cuốn kimchi", en: "Kimchi Somen Noodles" },
      desc: {
        vi: "Mì mát lạnh trong nước kimchi chua nhẹ, thanh sảng.",
        en: "Cool somen noodles in a lightly tangy kimchi broth."
      }
    },
    {
      id: "janchi-guksu",
      ko: "잔치국수",
      img: "assets/img/side-janchi-guksu.jpg",
      name: { vi: "Mì nước truyền thống (Janchi-guksu)", en: "Banquet Noodle Soup" },
      desc: {
        vi: "Mì nước truyền thống Hàn Quốc, nước dùng nhẹ nhàng ấm áp.",
        en: "A traditional Korean noodle soup in a light, comforting broth."
      }
    }
  ]
};
