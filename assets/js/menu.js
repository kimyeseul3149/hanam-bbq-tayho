/* Hanam BBQ Tây Hồ — menu data (v2)
 * Source of truth: docs/superpowers/specs/menu-v2-update.md §1–§5.
 * Prices are the real Tây Hồ branch prices, format "700,000 VND".
 * main = pork(7) → beef(2) → combo(2), IN THAT ORDER. side = 9. alcohol = 5 (no img).
 * Korean original kept as secondary label.
 * TODO(review): VN native check — vi/en name/desc are draft translations.
 */
window.MENU = {
  /* Popular = the six most-ordered picks, mirrored from the other tabs.
     Ids are prefixed pop- because findMenuItem() searches the active tab only. */
  popular: [
    {
      group: "popular", id: "pop-combo-pig-a", ko: "콤보 A",
      img: "assets/img/menu/combo-pig-a.jpg", price: "540,000 VND",
      name: { vi: "Combo A", en: "Combo A" },
      desc: {
        vi: "Ba chỉ heo 180g + Gáy heo 180g + 1 Canh trứng hấp.",
        en: "Pork Belly 180g + Pork Neck End 180g + 1 Steamed Egg."
      }
    },
    {
      group: "popular", id: "pop-combo-beef-prime", ko: "프라임 콤보",
      img: "assets/img/menu/combo-beef-prime.jpg", price: "1,650,000 VND",
      name: { vi: "Prime Combo", en: "Prime Combo" },
      desc: {
        vi: "Thăn hoa bò Prime 130g + Thăn lưng bò Prime 130g + Bẹ vai bò Prime 130g + 1 canh bất kỳ.",
        en: "Prime Beef Short Rib 130g + Prime Sirloin 130g + Prime Chuck Flap Tail 130g + One Stew."
      }
    },
    {
      group: "popular", id: "pop-saengsamgyeopsal", ko: "생삼겹살",
      img: "assets/img/hanam-cut-c.jpg", price: "250,000 VND",
      name: { vi: "Ba chỉ heo tươi", en: "Fresh Pork Belly" },
      desc: {
        vi: "Ba chỉ heo tươi (không ủ) cắt dày — ngoài giòn, trong mọng nước. Món kinh điển nhất định phải thử của BBQ Hàn Quốc.",
        en: "Thick-cut fresh (un-aged) pork belly — crisp outside, juicy within. The must-try classic of Korean BBQ."
      }
    },
    {
      group: "popular", id: "pop-steamed-egg", ko: "계란찜",
      img: "assets/img/side-steamed-egg.jpg", price: "90,000 VND",
      name: { vi: "Trứng hấp trứng cá chuồn", en: "Steamed Egg with Flying Fish Roe" },
      desc: {
        vi: "Trứng hấp mềm mịn như bông, điểm thêm trứng cá chuồn cho vị mặn nhẹ và độ giòn tan thú vị.",
        en: "Silky steamed egg, whipped light and fluffy, finished with flying fish roe for a gentle brine and a delicate pop."
      }
    },
    {
      group: "popular", id: "pop-kimchi-stew", ko: "돼지고기 김치찌개",
      img: "assets/img/side-kimchi-stew.jpg", price: "200,000 VND",
      name: { vi: "Canh kim chi thịt heo", en: "Pork Kimchi Stew" },
      desc: {
        vi: "Canh kim chi đậm đà nấu cùng thịt heo và kim chi lên men — món canh cân bằng hoàn hảo vị béo của thịt nướng.",
        en: "A deep, tangy stew of well-fermented kimchi and pork — the classic counterpoint to a rich grill."
      }
    },
    {
      group: "popular", id: "pop-mul-naengmyeon", ko: "물냉면",
      img: "assets/img/side-mul-naengmyeon.jpg", price: "150,000 VND",
      name: { vi: "Mì lạnh nước", en: "Cold Buckwheat Noodles in Broth" },
      desc: {
        vi: "Mì kiều mạch dai mát trong nước dùng lạnh thanh vị — món kết bữa sảng khoái sau khi nướng.",
        en: "Chewy buckwheat noodles in a clean, icy broth — the refreshing way to finish a grill."
      }
    }
  ],

  main: [
    /* ---------- Combo (8) ---------- */
    {
      group: "combo", id: "combo-pig-a", ko: "콤보 A",
      img: "assets/img/menu/combo-pig-a.jpg", price: "540,000 VND",
      name: { vi: "Combo A", en: "Combo A" },
      desc: {
        vi: "Ba chỉ heo 180g + Gáy heo 180g + 1 Canh trứng hấp.",
        en: "Pork Belly 180g + Pork Neck End 180g + 1 Steamed Egg."
      }
    },
    {
      group: "combo", id: "combo-pig-b", ko: "콤보 B",
      img: "assets/img/menu/combo-pig-b.jpg", price: "900,000 VND",
      name: { vi: "Combo B", en: "Combo B" },
      desc: {
        vi: "Ba chỉ heo 180g + Gáy heo 180g + Má heo 150g + 1 Trứng hấp + Khay nấm.",
        en: "Pork Belly 180g + Pork Neck End 180g + Jowl Meat 150g + 1 Steamed Egg + Assorted Mushrooms."
      }
    },
    {
      group: "combo", id: "combo-pig-c", ko: "콤보 C",
      img: "assets/img/menu/combo-pig-c.jpg", price: "1,250,000 VND",
      name: { vi: "Combo C", en: "Combo C" },
      desc: {
        vi: "Ba chỉ heo 360g + Má heo 150g + Nạc dây heo 150g + 1 Canh bất kỳ + Trứng hấp trứng cá chuồn.",
        en: "Pork Belly 360g + Jowl Meat 150g + Skirt Meat 150g + One Stew + 1 Steamed Egg with Flying Fish Roe."
      }
    },
    {
      group: "combo", id: "combo-pig-d", ko: "콤보 D",
      img: "assets/img/menu/combo-pig-d.jpg", price: "1,500,000 VND",
      name: { vi: "Combo D", en: "Combo D" },
      desc: {
        vi: "Ba chỉ heo 360g + Má heo 300g + Nạc dây heo 150g + 1 Canh bất kỳ + Trứng hấp trứng cá chuồn.",
        en: "Pork Belly 360g + Jowl Meat 300g + Skirt Meat 150g + One Stew + 1 Steamed Egg with Flying Fish Roe."
      }
    },
    {
      group: "combo", id: "combo-beef-a", ko: "소고기 콤보 A",
      img: "assets/img/menu/combo-beef-a.jpg", price: "1,260,000 VND",
      name: { vi: "Beef Combo A", en: "Beef Combo A" },
      desc: {
        vi: "Diềm bụng bò 150g + Dẻ sườn 300g + 1 Trứng hấp và Khay nấm.",
        en: "Hanging Tender 150g + Beef Short Rib Finger 300g + Steamed Egg and Assorted Mushrooms."
      }
    },
    {
      group: "combo", id: "combo-beef-b", ko: "소고기 콤보 B",
      img: "assets/img/menu/combo-beef-b.jpg", price: "1,800,000 VND",
      name: { vi: "Beef Combo B", en: "Beef Combo B" },
      desc: {
        vi: "Sườn hoa rút xương Prime 130g + Thăn lưng Prime 130g + Diềm bụng 150g + Dẻ sườn 150g + 1 canh bất kỳ.",
        en: "Prime Beef Short Rib 130g + Prime Sirloin 130g + Hanging Tender 150g + Beef Short Rib Finger 150g + One Stew."
      }
    },
    {
      group: "combo", id: "combo-beef-prime", ko: "프라임 콤보",
      img: "assets/img/menu/combo-beef-prime.jpg", price: "1,650,000 VND",
      name: { vi: "Prime Combo", en: "Prime Combo" },
      desc: {
        vi: "Thăn hoa bò Prime 130g + Thăn lưng bò Prime 130g + Bẹ vai bò Prime 130g + 1 canh bất kỳ.",
        en: "Prime Beef Short Rib 130g + Prime Sirloin 130g + Prime Chuck Flap Tail 130g + One Stew."
      }
    },
    {
      group: "combo", id: "combo-wagyu", ko: "와규 콤보",
      img: "assets/img/menu/combo-wagyu.jpg", price: "2,600,000 VND",
      name: { vi: "Wagyu Combo", en: "Wagyu Combo" },
      desc: {
        vi: "Thăn hoa Wagyu A5 130g + Thăn tôm Wagyu A5 130g + Bẹ vai Wagyu A5 130g + 1 Canh bất kỳ + 1 Trứng hấp.",
        en: "Wagyu Ribeye A5 130g + Wagyu Striploin A5 130g + Wagyu Chuck Flap Tail A5 130g + One Stew + Steamed Egg with Flying Fish Roe."
      }
    },
    /* ---------- Pork (7) ---------- */
    {
      group: "pork",
      id: "modum-hanpan",
      ko: "모둠한판",
      img: "assets/img/hanam-cut-a.jpg",
      price: "700,000 VND",
      name: { vi: "Set thịt nướng thập cẩm", en: "Combo Grill Platter" },
      desc: {
        vi: "Set thập cẩm hào phóng gồm các phần được yêu thích nhất — ba chỉ, nạc vai và nhiều hơn nữa — nướng chung để cả bàn cùng thưởng thức.",
        en: "A generous mix of our most-loved cuts — pork belly, collar and more — grilled together so the whole table can share every flavor."
      }
    },
    {
      group: "pork",
      id: "teukbyeol-hanpan",
      ko: "특별한판",
      img: "assets/img/hanam-cut-b.jpg",
      price: "1,000,000 VND",
      name: { vi: "Set nướng đặc biệt", en: "Special Grill Platter" },
      desc: {
        vi: "Tuyển chọn cao cấp các phần thịt đặc biệt cho trải nghiệm đậm đà hơn — cách tuyệt nhất để khám phá thịt heo đặc trưng của Hanam.",
        en: "A premium selection of special cuts for a richer tasting course — the best way to explore Hanam's signature pork."
      }
    },
    {
      group: "pork",
      id: "saengsamgyeopsal",
      ko: "생삼겹살",
      img: "assets/img/hanam-cut-c.jpg",
      price: "250,000 VND",
      name: { vi: "Ba chỉ heo tươi", en: "Fresh Pork Belly" },
      desc: {
        vi: "Ba chỉ heo tươi (không ủ) cắt dày — ngoài giòn, trong mọng nước. Món kinh điển nhất định phải thử của BBQ Hàn Quốc.",
        en: "Thick-cut fresh (un-aged) pork belly — crisp outside, juicy within. The must-try classic of Korean BBQ."
      }
    },
    {
      group: "pork",
      id: "teukmoksal",
      ko: "특목살",
      img: "assets/img/hanam-cut-d.jpg",
      price: "250,000 VND",
      name: { vi: "Thịt nạc vai đặc biệt", en: "Premium Pork Collar" },
      desc: {
        vi: "Phần mềm nhất của thịt nạc vai — nạc, thanh vị, không bị khô, mềm tinh tế.",
        en: "The tenderest part of the pork collar — lean, clean-tasting and never dry, with a delicate bite."
      }
    },
    {
      group: "pork",
      id: "galmaegisal",
      ko: "갈매기살",
      img: "assets/img/hanam-cut-f.jpg",
      price: "270,000 VND",
      name: { vi: "Thịt cơ hoành heo", en: "Pork Skirt Meat" },
      desc: {
        vi: "Phần cơ hoành hiếm — mỗi con heo chỉ có một ít. Thớ dai sần sật, vị đậm đà.",
        en: "A rare diaphragm cut — only a little per pig. Springy, chewy texture with a deep savory taste."
      }
    },
    {
      group: "pork",
      id: "hangjeongsal",
      ko: "항정살",
      img: "assets/img/hanam-cut-g.jpg",
      price: "270,000 VND",
      name: { vi: "Thịt má heo", en: "Pork Jowl (Presa)" },
      desc: {
        vi: "Phần má/nọng quý với vân mỡ mịn — mềm tan trong miệng, béo ngậy đậm đà.",
        en: "The prized jowl cut with fine marbling — melt-in-the-mouth tender and richly savory."
      }
    },
    {
      group: "pork",
      id: "gabrisal",
      ko: "가브리살",
      img: "assets/img/hanam-cut-h.jpg",
      price: "270,000 VND",
      name: { vi: "Thịt nạc dày", en: "Pork Collar Cap (Pluma)" },
      desc: {
        vi: "Phần đặc biệt dày phía trên nạc vai — càng nhai càng cảm nhận nước thịt đậm đà tứa ra.",
        en: "A thick special cut above the collar — the more you chew, the more its rich juices come through."
      }
    },

    /* ---------- Beef (8) ---------- */
    {
      group: "beef", id: "prime-kkotsal", ko: "프라임 꽃살",
      img: "assets/img/menu/beef-kkotsal.jpg", price: "600,000 VND",
      name: { vi: "Sườn hoa rút xương Prime 130g", en: "Prime Beef Short Rib 130g" },
      desc: {
        vi: "Phần sườn hoa Prime, vân mỡ xen kẽ đều, thịt mềm mọng và thơm ngọt tự nhiên. Khi nướng cho hương vị đậm đà, béo ngậy và cực kỳ hấp dẫn.",
        en: "Prime beef short rib with beautiful marbling, juicy tenderness, and rich flavor when grilled."
      }
    },
    {
      group: "beef", id: "prime-salchisal", ko: "프라임 살치살",
      img: "assets/img/menu/beef-salchisal.jpg", price: "550,000 VND",
      name: { vi: "Bẹ vai Prime 130g", en: "Prime Chuck Flap Tail 130g" },
      desc: {
        vi: "Phần bẹ vai Prime, nổi bật với hương vị đậm đà và thớ thịt chắc khỏe. Khi nướng, lớp mỡ mỏng tan chảy hòa quyện với nạc, tạo nên vị ngọt béo hài hòa và thơm lừng.",
        en: "Prime chuck flap tail offering a bold beefy flavor, balanced marbling, and a rich taste enhanced when grilled."
      }
    },
    {
      group: "beef", id: "prime-deungsim", ko: "프라임 등심",
      img: "assets/img/menu/beef-deungsim.jpg", price: "500,000 VND",
      name: { vi: "Thăn lưng bò Prime 130g", en: "Prime Sirloin 130g" },
      desc: {
        vi: "Thăn lưng bò Prime, thớ thịt săn chắc, ít mỡ, vị ngọt đậm và dậy hương bò đặc trưng. Thích hợp cho khách muốn thưởng thức hương vị bò nguyên bản.",
        en: "Prime sirloin with lean tenderness, a bold beefy taste, and balanced tenderness — for those who enjoy a pure beef flavor."
      }
    },
    {
      group: "beef", id: "hwangje-neukgansal", ko: "황제늑간살",
      img: "assets/img/menu/beef-neukgan.jpg", price: "370,000 VND",
      name: { vi: "Dẻ sườn 150g", en: "Beef Short Rib Finger 150g" },
      desc: {
        vi: "Phần dẻ sườn, xen kẽ nhiều gân nhỏ tạo độ giòn sần sật. Khi nướng tỏa hương thơm đặc trưng, thịt đậm đà, vừa giòn vừa ngọt, rất được yêu thích.",
        en: "Beef short rib finger with rich flavor, a chewy-crisp texture, and a savory taste that stands out when grilled."
      }
    },
    {
      group: "beef", id: "tosisal", ko: "토시살",
      img: "assets/img/menu/beef-tosisal.jpg", price: "370,000 VND",
      name: { vi: "Diềm bụng 150g", en: "Hanging Tender 150g" },
      desc: {
        vi: "Phần diềm bụng cách gân mỡ, mỗi con bò chỉ có một miếng nhỏ, hương vị đậm đà đặc trưng. Thịt mềm nhưng chắc, xen chút gân tạo độ giòn, khi nướng dậy mùi thơm khó quên.",
        en: "Hanging tender with a bold beefy flavor — a rare cut with juicy tenderness and a slightly chewy bite that stands out when grilled."
      }
    },
    {
      group: "beef", id: "wagyu-salchisal-a5", ko: "와규 살치살 A5",
      img: "assets/img/menu/wagyu-salchisal.jpg", price: "800,000 VND",
      name: { vi: "Bẹ vai Wagyu A5 130g", en: "Wagyu Chuck Flap Tail A5 130g" },
      desc: {
        vi: "Phần bẹ vai Wagyu A5, nổi bật với thớ thịt vân sắc nét, khi nướng tỏa hương thơm đậm đà. Thịt vừa mềm vừa có độ dai nhẹ, cho trải nghiệm trọn vẹn vị Wagyu cao cấp.",
        en: "Wagyu A5 chuck flap tail with a firm yet tender texture, delicate marbling, and a rich savory aroma when grilled."
      }
    },
    {
      group: "beef", id: "wagyu-saewoosal-a5", ko: "와규 새우살 A5",
      img: "assets/img/menu/wagyu-saewoo.jpg", price: "790,000 VND",
      name: { vi: "Thăn tôm Wagyu A5 130g", en: "Wagyu Striploin A5 130g" },
      desc: {
        vi: "Phần thăn tôm Wagyu A5 — hạng cao cấp nhất, nổi bật với vân mỡ hoàn hảo, thịt mềm tan, hương vị béo ngậy và ngọt thơm đặc trưng.",
        en: "Premium Wagyu A5 striploin with exceptional marbling, buttery tenderness, and a rich, melt-in-the-mouth flavor."
      }
    },
    {
      group: "beef", id: "wagyu-kkotdeungsim-a5", ko: "와규 꽃등심 A5",
      img: "assets/img/menu/wagyu-kkotdeung.jpg", price: "790,000 VND",
      name: { vi: "Thăn hoa Wagyu A5 130g", en: "Wagyu Ribeye A5 130g" },
      desc: {
        vi: "Phần thăn hoa Wagyu A5, nổi bật với vân mỡ hoa đẹp mắt, thịt mềm ngọt, béo ngậy và đậm đà. Là phần thịt cao cấp, mang lại trải nghiệm trọn vẹn trong từng miếng.",
        en: "Premium Wagyu A5 ribeye with exquisite marbling, tender juiciness, and rich flavor in every bite."
      }
    },

    /* ---------- Lunch Set (2, last) ----------
       One card per dish; both combos live in the description, so each card can
       use a single large photo instead of four heavily upscaled crops. */
    {
      group: "lunch", id: "lunch-galbi", ko: "양념목살갈비",
      img: "assets/img/menu/lunch-galbi.jpg", price: "200,000 VND",
      name: { vi: "Nạc sườn vai sốt tương", en: "Soy-Marinated Pork Neck" },
      desc: {
        vi: "COMBO A: 1 phần nạc sườn vai sốt tương + 1 mỳ lạnh nước hoặc mỳ lạnh trộn.\nCOMBO B: 1 phần nạc sườn vai sốt tương + 1 canh đậu tương (nhỏ) + 1 cơm trắng.\nThêm trứng hấp chỉ với 50.000 VND.",
        en: "COMBO A: 1 Soy Sauce Marinated Pork Neck + 1 Cold Buckwheat Noodle (broth or spicy).\nCOMBO B: 1 Soy Sauce Marinated Pork Neck + 1 Soybean Paste Stew (small) + 1 Steamed Rice.\nAdd Steamed Egg for 50,000 VND."
      }
    },
    {
      group: "lunch", id: "lunch-jeyuk", ko: "제육볶음",
      img: "assets/img/menu/lunch-jeyuk.jpg", price: "200,000 VND",
      name: { vi: "Thịt heo xào cay", en: "Spicy Stir-Fried Pork" },
      desc: {
        vi: "COMBO A: 1 phần thịt heo xào cay + 1 mỳ lạnh nước hoặc mỳ lạnh trộn.\nCOMBO B: 1 phần thịt heo xào cay + 1 canh đậu tương (nhỏ) + 1 cơm trắng.\nThêm trứng hấp chỉ với 50.000 VND.",
        en: "COMBO A: 1 Spicy Stir-Fried Pork + 1 Cold Buckwheat Noodle (broth or spicy).\nCOMBO B: 1 Spicy Stir-Fried Pork + 1 Soybean Paste Stew (small) + 1 Steamed Rice.\nAdd Steamed Egg for 50,000 VND."
      }
    }
  ],

  side: [
    {
      id: "kimchi-stew",
      ko: "돼지고기 김치찌개",
      img: "assets/img/side-kimchi-stew.jpg",
      price: "200,000 VND",
      name: { vi: "Canh kimchi thịt heo", en: "Pork Kimchi Stew" },
      desc: {
        vi: "Kimchi lên men kỹ ninh cùng thịt heo mềm — chua nhẹ, ấm bụng và rất đưa cơm.",
        en: "Well-fermented kimchi simmered with tender pork — tangy, warming and deeply comforting."
      }
    },
    {
      id: "doenjang-stew",
      ko: "된장찌개",
      img: "assets/img/side-doenjang-stew.jpg",
      price: "200,000 VND",
      name: { vi: "Canh tương đậu", en: "Soybean Paste Stew" },
      desc: {
        vi: "Canh tương đậu Hàn Quốc đậm đà với đậu phụ và rau — thanh vị, ấm áp như cơm nhà.",
        en: "Hearty Korean soybean-paste stew with tofu and vegetables — savory and homey."
      }
    },
    {
      id: "gochujang-stew",
      ko: "고추장찌개",
      img: "assets/img/side-gochujang-stew.jpg",
      price: "200,000 VND",
      name: { vi: "Canh tương ớt", en: "Gochujang Stew" },
      desc: {
        vi: "Canh tương ớt đỏ cay nhẹ — đậm đà, hấp dẫn và cực hợp với cơm.",
        en: "A gently spicy red chili-paste stew — bold, savory and perfect with rice."
      }
    },
    {
      id: "mul-naengmyeon",
      ko: "물냉면",
      img: "assets/img/side-mul-naengmyeon.jpg",
      price: "150,000 VND",
      name: { vi: "Mì lạnh nước", en: "Cold Buckwheat Noodle Soup" },
      desc: {
        vi: "Mì kiều mạch lạnh trong nước dùng thanh mát — món kết thúc hoàn hảo sau bữa nướng.",
        en: "Chilled buckwheat noodles in a clean, refreshing broth — the perfect cool finish to a grill."
      }
    },
    {
      id: "bibim-naengmyeon",
      ko: "비빔냉면",
      img: "assets/img/side-hoe-naengmyeon.jpg",
      price: "150,000 VND",
      name: { vi: "Mì lạnh trộn cay", en: "Spicy Cold Noodles" },
      desc: {
        vi: "Mì lạnh dai trộn sốt chua cay ngọt — đậm đà, gây nghiện và sảng khoái.",
        en: "Chewy cold noodles tossed in a sweet-spicy sauce — bold, addictive and refreshing."
      }
    },
    {
      id: "janchi-guksu",
      ko: "잔치국수",
      img: "assets/img/side-janchi-guksu.jpg",
      price: "140,000 VND",
      name: { vi: "Mì nước truyền thống", en: "Banquet Noodle Soup" },
      desc: {
        vi: "Mì somen mảnh trong nước dùng thanh nhẹ — món truyền thống Hàn ấm lòng.",
        en: "Warm thin somen in a light, savory broth — a comforting Korean classic."
      }
    },
    {
      id: "kimchi-noodles",
      ko: "김치말이국수",
      img: "assets/img/side-kimchi-noodles.jpg",
      price: "140,000 VND",
      name: { vi: "Mì cuốn kimchi", en: "Kimchi Somen Noodles" },
      desc: {
        vi: "Mì somen mát trong nước kimchi lạnh chua nhẹ — thanh, kích vị và sảng khoái.",
        en: "Cool somen in a tangy chilled kimchi broth — light, zesty and refreshing."
      }
    },
    {
      id: "steamed-egg",
      ko: "계란찜",
      img: "assets/img/side-steamed-egg.jpg",
      price: "90,000 VND",
      name: { vi: "Trứng hấp", en: "Steamed Egg" },
      desc: {
        vi: "Trứng hấp mềm mịn, bông xốp — béo nhẹ, món phụ được mọi lứa tuổi yêu thích.",
        en: "Silky, fluffy steamed egg — soft, savory and a favorite side for all ages."
      }
    },
    {
      id: "kimchi-fried-rice",
      ko: "도시락 김치볶음밥",
      img: "assets/img/side-kimchi-fried-rice.jpg",
      price: "130,000 VND",
      name: { vi: "Cơm rang kimchi", en: "Kimchi Fried Rice" },
      desc: {
        vi: "Cơm rang kimchi thơm mùi khói trong hộp cơm thiếc kiểu retro — lắc đều rồi thưởng thức.",
        en: "Smoky kimchi fried rice in a retro tin lunchbox — shake it up and enjoy."
      }
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
