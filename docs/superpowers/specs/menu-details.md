# 메뉴 상세 설명 + 클릭 모달 (AUTHORITATIVE) — 2026-07-12

요청: 메뉴 카드 클릭 시 **사진이 크게 뜨고 상세 설명이 나오는 모달(라이트박스)**. 전 메뉴에 상세 설명 추가.
번역 vi/en 초벌(원어민 검수 대상). 각 항목의 `desc:{vi,en}`에 아래 텍스트를 넣는다(기존 beef/combo desc는 유지).

## 돼지고기 (pork) — desc 추가
- **모둠한판**
  - EN: "A generous mix of our most-loved cuts — pork belly, collar and more — grilled together so the whole table can share every flavor."
  - VI: "Set thập cẩm hào phóng gồm các phần được yêu thích nhất — ba chỉ, nạc vai và nhiều hơn nữa — nướng chung để cả bàn cùng thưởng thức."
- **특별한판**
  - EN: "A premium selection of special cuts for a richer tasting course — the best way to explore Hanam's signature pork."
  - VI: "Tuyển chọn cao cấp các phần thịt đặc biệt cho trải nghiệm đậm đà hơn — cách tuyệt nhất để khám phá thịt heo đặc trưng của Hanam."
- **생삼겹살**
  - EN: "Thick-cut fresh (un-aged) pork belly — crisp outside, juicy within. The must-try classic of Korean BBQ."
  - VI: "Ba chỉ heo tươi (không ủ) cắt dày — ngoài giòn, trong mọng nước. Món kinh điển nhất định phải thử của BBQ Hàn Quốc."
- **특목살**
  - EN: "The tenderest part of the pork collar — lean, clean-tasting and never dry, with a delicate bite."
  - VI: "Phần mềm nhất của thịt nạc vai — nạc, thanh vị, không bị khô, mềm tinh tế."
- **갈매기살**
  - EN: "A rare diaphragm cut — only a little per pig. Springy, chewy texture with a deep savory taste."
  - VI: "Phần cơ hoành hiếm — mỗi con heo chỉ có một ít. Thớ dai sần sật, vị đậm đà."
- **항정살**
  - EN: "The prized jowl cut with fine marbling — melt-in-the-mouth tender and richly savory."
  - VI: "Phần má/nọng quý với vân mỡ mịn — mềm tan trong miệng, béo ngậy đậm đà."
- **가브리살**
  - EN: "A thick special cut above the collar — the more you chew, the more its rich juices come through."
  - VI: "Phần đặc biệt dày phía trên nạc vai — càng nhai càng cảm nhận nước thịt đậm đà tứa ra."

## 소고기 (beef) — 기존 desc 유지 (변경 없음)
- 와규 살치살 A5 / 와규 콤보 : 이미 desc 있음, 그대로 사용.

## 런치세트 (combo) — 기존 desc 유지 (변경 없음)
- 양념목살갈비 세트 / 제육볶음 세트 : COMBO A/B + 계란찜 추가 desc 그대로 사용.

## 사이드 (side) — desc 추가
- **돼지고기 김치찌개**
  - EN: "Well-fermented kimchi simmered with tender pork — tangy, warming and deeply comforting."
  - VI: "Kimchi lên men kỹ ninh cùng thịt heo mềm — chua nhẹ, ấm bụng và rất đưa cơm."
- **된장찌개**
  - EN: "Hearty Korean soybean-paste stew with tofu and vegetables — savory and homey."
  - VI: "Canh tương đậu Hàn Quốc đậm đà với đậu phụ và rau — thanh vị, ấm áp như cơm nhà."
- **고추장찌개**
  - EN: "A gently spicy red chili-paste stew — bold, savory and perfect with rice."
  - VI: "Canh tương ớt đỏ cay nhẹ — đậm đà, hấp dẫn và cực hợp với cơm."
- **물냉면**
  - EN: "Chilled buckwheat noodles in a clean, refreshing broth — the perfect cool finish to a grill."
  - VI: "Mì kiều mạch lạnh trong nước dùng thanh mát — món kết thúc hoàn hảo sau bữa nướng."
- **비빔냉면**
  - EN: "Chewy cold noodles tossed in a sweet-spicy sauce — bold, addictive and refreshing."
  - VI: "Mì lạnh dai trộn sốt chua cay ngọt — đậm đà, gây nghiện và sảng khoái."
- **잔치국수**
  - EN: "Warm thin somen in a light, savory broth — a comforting Korean classic."
  - VI: "Mì somen mảnh trong nước dùng thanh nhẹ — món truyền thống Hàn ấm lòng."
- **김치말이국수**
  - EN: "Cool somen in a tangy chilled kimchi broth — light, zesty and refreshing."
  - VI: "Mì somen mát trong nước kimchi lạnh chua nhẹ — thanh, kích vị và sảng khoái."
- **계란찜**
  - EN: "Silky, fluffy steamed egg — soft, savory and a favorite side for all ages."
  - VI: "Trứng hấp mềm mịn, bông xốp — béo nhẹ, món phụ được mọi lứa tuổi yêu thích."
- **도시락 김치볶음밥**
  - EN: "Smoky kimchi fried rice in a retro tin lunchbox — shake it up and enjoy."
  - VI: "Cơm rang kimchi thơm mùi khói trong hộp cơm thiếc kiểu retro — lắc đều rồi thưởng thức."

## 모달(라이트박스) 동작 사양
- **대상**: 사진이 있는 카드(메인=돼지/소고기/콤보, 사이드). 주류 탭은 사진 없는 리스트라 제외.
- **트리거**: 카드 클릭/터치, 키보드 포커스(role=button, tabindex=0, Enter/Space). 커서 pointer.
- **모달 내용**: 큰 이미지(상단, 카드보다 크게) + 한국어 이름(.menu-ko 색) + 현재 언어 이름 + 가격 + 상세 설명(현재 언어). 콤보는 여러 줄 desc 줄바꿈 유지.
- **닫기**: × 버튼 + 오버레이(배경) 클릭 + ESC. body 스크롤 잠금(열릴 때).
- **언어**: 열려있는 동안/재열 때 현재 선택 언어 반영.
- **디자인**: 다크 프리미엄 + 골드, 기존 토큰 재사용. 모바일에서 거의 풀스크린, 데스크톱 중앙 카드. 이미지 max-width 100%, 세로 스크롤은 모달 내부에서.
- **접근성**: 모달 role="dialog" aria-modal, 포커스 이동/닫기 후 원래 카드로 포커스 복귀(가능하면), 이미지 alt.
