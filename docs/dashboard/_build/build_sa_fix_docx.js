// SA 전략 — 앰플리튜드 수치 수정본 (Google Docs 업로드용 .docx)
//
// 원본 문서에서 고쳐야 할 자리만 위치별로 싣는다. 표는 columnWidths 와 셀 width 를
// DXA 로 함께 지정한다 — PERCENTAGE 는 Google Docs 에서 열 폭이 무너진다.
// 색은 쓰지 않는다(검정·회색만).
const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, HeadingLevel, BorderStyle, ShadingType,
} = require('docx');

const FONT = '맑은 고딕';
const BK = '000000';
const GY = '595959';
const LN = 'BFBFBF';
const W = 9020;                      // A4(11906) - 좌우 여백(1440*2)
const THIN = { style: BorderStyle.SINGLE, size: 4, color: LN };

const t = (text, o = {}) => new TextRun({
  text, font: o.font || FONT, size: o.size || 18, bold: !!o.bold,
  color: o.color || BK, strike: !!o.strike,
});

const p = (runs, o = {}) => new Paragraph({
  children: Array.isArray(runs) ? runs : [runs],
  spacing: { before: o.before || 0, after: o.after == null ? 70 : o.after, line: o.line || 274 },
  indent: o.indent,
});

const h1 = (text, sub) => [
  new Paragraph({
    children: [t(text, { size: 26, bold: true })],
    spacing: { after: 40 }, heading: HeadingLevel.HEADING_1,
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: BK } },
  }),
  ...(sub ? [p(t(sub, { size: 16, color: GY }), { after: 60 })] : []),
];

const h2 = (text) => new Paragraph({
  children: [t(text, { size: 21, bold: true })],
  spacing: { before: 260, after: 100 }, heading: HeadingLevel.HEADING_2,
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: LN } },
});

const h3 = (text) => new Paragraph({
  children: [t(text, { size: 19, bold: true })],
  spacing: { before: 190, after: 70 }, heading: HeadingLevel.HEADING_3,
});

// 그대로 옮겨 붙일 블록 — 왼쪽 세로줄로 본문과 구분
const box = (lines, o = {}) => lines.map((ln, i) => new Paragraph({
  children: Array.isArray(ln) ? ln : [t(ln, { size: o.size || 18 })],
  spacing: {
    before: i === 0 ? 40 : 0,
    after: i === lines.length - 1 ? 80 : (o.gap == null ? 30 : o.gap),
    line: 288,
  },
  indent: { left: 260 },
  border: { left: { style: BorderStyle.SINGLE, size: 12, color: LN, space: 10 } },
}));

const note = (text) => p(t(text, { size: 16, color: GY }), { after: 60 });

function row(cells, widths, o = {}) {
  return new TableRow({
    tableHeader: !!o.header,
    children: cells.map((c, i) => new TableCell({
      width: { size: widths[i], type: WidthType.DXA },
      shading: (o.header || c.shade) ? { type: ShadingType.CLEAR, fill: 'F2F2F2', color: 'auto' } : undefined,
      margins: { top: 55, bottom: 55, left: 100, right: 100 },
      borders: { top: THIN, bottom: THIN, left: THIN, right: THIN },
      children: [new Paragraph({
        children: [t(c.text, {
          size: 15, bold: o.header || c.bold,
          color: c.color || (o.header ? BK : GY), strike: c.strike,
        })],
        spacing: { after: 0, line: 250 },
        alignment: c.align,
      })],
    })),
  });
}
const table = (widths, rows) => new Table({
  columnWidths: widths, width: { size: W, type: WidthType.DXA }, rows,
});

// ── 수정 요약 ────────────────────────────────────────────────────
const wS = [1500, 2500, 2510, 2510];
const tblSum = table(wS, [
  row([{ text: '위치' }, { text: '항목' }, { text: '기존' }, { text: '수정' }], wS, { header: true }),
  ...[
    ['장표 04', '퍼널 도표', '클릭 17,828 → 도착 8,374 → CTA 108', '고유 클릭 14,570 → 도착 8,084 → CTA 110 → 예약 유도 90'],
    ['장표 04', '체류 시간', '13초', '삭제 — 앰플리튜드로 측정 불가'],
    ['장표 04', '언어 전환 비율', '메뉴 본 사람의 53%', '삭제 — 실제 16.2%로 근거 부족'],
    ['장표 04', 'Dead Click', '74건', '삭제 — 34건이 로고 오탐'],
    ['장표 04', '추적 불가 비중', '44.4%', '45.9% (이벤트 133건 기준)'],
    ['장표 05', '기준 소재 점유', '108건 중 71건 (65.7%)', '90명 중 64명 (71.1%)'],
    ['부록 ②', '랜딩 도착', '8,374 (도착률 47.0%)', '8,084 (도착률 55.5%)'],
    ['부록 ②', 'CTA 클릭', '108', '110명 (133건)'],
    ['부록 ②', 'CPA', '81,634 VND', '97,961 VND (예약 유도 90명 기준)'],
    ['부록 ②', '소재별 표', 'CTA 기준', '예약 유도 기준 + 고유 클릭 열 추가'],
  ].map(r => row([
    { text: r[0], bold: true, color: BK },
    { text: r[1], bold: true, color: BK },
    { text: r[2] },
    { text: r[3], color: BK },
  ], wS)),
]);

// ── 45.9% 근거 ───────────────────────────────────────────────────
const wB = [3000, 1800, 1800, 2420];
const tblBase = table(wB, [
  row([{ text: '행동' }, { text: '건수' }, { text: '비중' }, { text: '추적' }], wB, { header: true }),
  ...[
    ['메시지 예약', '61', '45.9%', '가능'],
    ['전화 걸기', '45', '33.8%', '불가'],
    ['길찾기', '16', '12.0%', '불가'],
    ['메뉴 보기', '11', '8.3%', '가능'],
  ].map(r => row([
    { text: r[0], bold: true, color: BK }, { text: r[1] }, { text: r[2] }, { text: r[3] },
  ], wB)),
  row([
    { text: '합계', bold: true, color: BK, shade: true },
    { text: '133', bold: true, color: BK, shade: true },
    { text: '100%', bold: true, color: BK, shade: true },
    { text: '45.9% 추적 불가', bold: true, color: BK, shade: true },
  ], wB),
]);

// ── 부록 ② 숫자 전부 ─────────────────────────────────────────────
const wA = [2600, 2600, 3820];
const APX = [
  ['노출', '460,195', '메타 광고 관리자 (정확)'],
  ['전체 링크클릭', '17,828', '메타 — CTR·CPC 산출 기준'],
  ['고유 링크클릭', '14,570', '메타 — 도착률 분모'],
  ['지출', '8,816,522 VND', '메타 (예산 소진)'],
  ['랜딩 도착', '8,084  (도착률 55.5%)', '앰플리튜드 · 고유 device_id'],
  ['도착 전 이탈', '6,486  (44.5%)', '계산값 = 14,570 − 8,084'],
  ['CTA 클릭', '110명 (133건) · 1.36%', '앰플리튜드「CTA Clicked」'],
  ['예약 유도', '90명 (106건) · 1.11%', 'cta_type ∈ {message_book, call_phone}'],
  ['무행동 이탈', '95.1%', '아무 버튼도 누르지 않은 방문자'],
  ['유도당 비용', '97,961 VND (약 5,267원)', '지출 ÷ 예약 유도 90명 · 환율 18.6'],
  ['릴스 노출 비중', '63.9%  (293,874 ÷ 460,195)', '메타 지면 데이터'],
  ['전환 소요 시간 중앙값', '12.5초', '예약 CTA를 누른 94명 한정 — 체류시간 아님'],
];
const tblApx = table(wA, [
  row([{ text: '지표' }, { text: '값' }, { text: '원천 · 산출' }], wA, { header: true }),
  ...APX.map(r => row([
    { text: r[0], bold: true, color: BK }, { text: r[1], color: BK }, { text: r[2] },
  ], wA)),
]);

// ── 소재별 표 ────────────────────────────────────────────────────
const wC = [2200, 1250, 1150, 1150, 1050, 1050, 1170];
const CRE = [
  ['비즈니스 × 맛 (영상)', '199,294', '10,226', '7,955', '4,415', '64', '₫64,828'],
  ['가족 × 맛 (영상)', '141,222', '4,197', '3,881', '2,028', '11', '₫238,690'],
  ['가족 × 생일 (영상)', '65,218', '2,707', '2,620', '1,442', '12', '₫124,832'],
  ['가족 × 생일 (이미지)', '37,899', '293', '273', '120', '2', '₫116,188'],
  ['비즈니스 × 공간 (영상)', '5,022', '170', '168', '122', '0', '—'],
  ['비즈니스 × 공간 (캐러셀)', '11,540', '235', '227', '48', '0', '—'],
];
const tblCre = table(wC, [
  row([{ text: '소재' }, { text: '노출' }, { text: '전체 클릭' }, { text: '고유 클릭' },
       { text: '방문' }, { text: '예약 유도' }, { text: '유도당 비용' }], wC, { header: true }),
  ...CRE.map(r => row(r.map((v, i) => ({ text: v, bold: i === 0, color: i === 0 ? BK : GY })), wC)),
  row([
    { text: '전체', bold: true, color: BK, shade: true },
    { text: '460,195', bold: true, color: BK, shade: true },
    { text: '17,828', bold: true, color: BK, shade: true },
    { text: '14,570', bold: true, color: BK, shade: true },
    { text: '8,084', bold: true, color: BK, shade: true },
    { text: '90', bold: true, color: BK, shade: true },
    { text: '₫97,961', bold: true, color: BK, shade: true },
  ], wC),
]);

// ── 장표 04 하단 표 ──────────────────────────────────────────────
const wD = [4300, 4720];
const tblD = table(wD, [
  row([{ text: '데이터 (사실)' }, { text: '그래서 (실행)' }], wD, { header: true }),
  ...[
    ['고유 클릭 14,570 → 도착 8,084 (55.5%) · 노출의 64%가 릴스',
     '의도를 갖고 누르는 «검색»으로 옮긴다'],
    ['방문자의 95.1%가 아무것도 누르지 않고 이탈 · 예약 CTA의 85.9%가 첫 화면·플로팅에 집중',
     '첫 화면에 예약 버튼 고정'],
    ['예약 행동의 45.9%가 전화·길찾기로 이탈 → 추적 불가',
     '광고가 도착할 «예약 전용 페이지»가 필요하다'],
  ].map(r => row([{ text: r[0], color: BK }, { text: r[1], bold: true, color: BK }], wD)),
]);

const SCRIPT = [
  '저희 전략은 아이디어가 아니라 이 데이터에서 그대로 나왔습니다.',
  '광고를 클릭한 1만 4천 5백 명 중 저희 페이지를 실제로 본 사람은 8천 명이었습니다.',
  '45%가 도착 전에 사라졌고, 노출의 64%가 릴스였습니다.',
  '스크롤하다 잘못 누른 클릭이라는 뜻입니다.',
  '그래서 의도를 갖고 누르는 검색으로 옮깁니다.',
  '',
  '도착한 사람도 95%는 아무것도 누르지 않고 나갔습니다.',
  '반면 예약 버튼을 누른 사람의 86%는 첫 화면과 플로팅 버튼에서 눌렀습니다.',
  '버튼은 제 역할을 했다는 뜻입니다. 그래서 첫 화면에 예약 버튼을 고정합니다.',
  '',
  '그리고 예약 행동의 45.9%가 전화와 길찾기로 페이지를 빠져나가',
  '그 뒤를 추적할 수 없었습니다. 광고로 데려와도 예약이 됐는지 알 수가 없습니다.',
  '그래서 광고가 도착할 «예약 전용 페이지»가 필요합니다.',
  '예약이 한 곳에서 끝나야 광고에서 방문까지가 하나의 숫자로 이어집니다.',
];

const doc = new Document({
  styles: { default: { document: { run: { font: FONT, size: 18, color: BK } } } },
  sections: [{
    properties: { page: { margin: { top: 1000, bottom: 900, left: 1440, right: 1440 } } },
    children: [
      ...h1('SA 전략 — 앰플리튜드 수치 수정본',
        '하남돼지집 서호수점 · 2026-07-20 ~ 08-02 (14일) · 기준: 하남BBQ_웹페이지분석데이터(7.20~8.2).xlsx'),

      p(t('원본 「하남 SA 전략(초안)」에서 고쳐야 할 자리만 위치 순서대로 실었습니다. 각 항목의 회색 세로줄 블록을 그대로 복사해 원본의 해당 위치에 붙여넣으면 됩니다. 여기 실린 모든 수치는 마케팅 운영 대시보드 1~3페이지와 완전히 일치합니다.', { color: GY })),
      p([t('장표 01 · 02 · 03 은 수정 사항이 없습니다.', { bold: true }),
         t(' 검색·SEO·경쟁사 내용이라 앰플리튜드 수치를 쓰지 않습니다.', { color: GY })]),

      h2('수정 요약'),
      tblSum,

      h2('장표 04 — 연결'),

      h3('① 「영역 / 내용」 표 — 상단 행'),
      ...box(['퍼널 도표 — 고유 클릭 14,570 → 도착 8,084 → CTA 110 → 예약 유도 90']),
      note('※ s4-funnel.png 이미지도 다시 만들어야 합니다. 숫자가 그림 안에 들어 있습니다.'),

      h3('② 「장표 하단에 그대로 넣을 표」 — 3행 전체 교체'),
      tblD,
      note('2행이 기존에는 「체류 13초 · Dead Click 74 · 언어 전환 53%」였습니다. 셋 다 근거가 없어 교체했고, 실행 항목에서 「언어 자동 감지」를 뺐습니다 — 실제 언어 전환은 메뉴를 본 37명 중 6명(16.2%)이라 근거가 되지 않습니다.'),

      h3('③ 읽을 대본 — 전체 교체'),
      ...box(SCRIPT, { gap: 0 }),

      h3('④ 「44.4%의 근거」 → 「45.9%의 근거」'),
      tblBase,
      note('각주 교체 — 앰플리튜드「CTA Clicked」를 cta_type별로 분해한 값(이벤트 기준, 2026.7.20–8.2). 정확. 사용자 기준은 110명이며, 한 사람이 전화와 길찾기를 모두 누르면 중복 집계되어 비중 계산에 쓸 수 없습니다.'),

      h2('장표 05 — 결론'),

      h3('「마지막 문단의 근거」 표 아래 각주'),
      ...box([[
        t('키워드 213개를 의도별로 분류한 결과 (Google Keyword Planner). 메타에서 검증된 소구점은 「비즈니스 × 맛」 — '),
        t('예약 유도 90명 중 64명(71.1%)', { bold: true }),
        t('이 이 소재 하나에서 나왔고, 유도당 비용도 '),
        t('64,828동', { bold: true }),
        t('으로 전체 평균 97,961동보다 낮음.'),
      ]]),
      note('읽을 대본은 그대로 두셔도 됩니다 — 이 숫자를 소리 내어 읽지 않습니다. 오히려 65.7% → 71.1%로 근거가 강해집니다.'),

      h2('부록 ② — 04에서 말하는 숫자 전부'),
      tblApx,
      note('각주 교체 — 「도착 전 이탈」은 원본에 없는 계산값입니다. 도착률은 고유 클릭 기준으로 산출했습니다. 방문자가 사람 수이므로, 같은 사람의 반복 클릭을 포함한 전체 클릭과는 단위가 맞지 않습니다.'),
      p([t('삭제할 행 — ', { bold: true }),
         t('체류 시간 중앙값 13초', { strike: true }), t(' · ', { color: GY }),
         t('Dead Click 74건 / Rage Click 19건', { strike: true }), t(' · ', { color: GY }),
         t('언어 전환 ÷ 메뉴 조회 53%', { strike: true })]),
      note('체류 시간은 session_end 이벤트가 전체 세션의 14.9%에만 존재해 측정이 불가능합니다(01_데이터품질 시트). Dead Click은 89건 중 34건이 로고 오탐이라 같은 시트에서 「근거로 사용 금지」로 분류되어 있습니다.'),

      h2('부록 ② — 소재별 성과'),
      tblCre,
      note('각주 교체 — 방문 N < 300 소재(가족×생일 이미지 120 · 비즈니스×공간 영상 122 · 캐러셀 48)는 표본이 작아 비율 비교에서 제외했습니다. 「비즈니스 × 맛」은 물량과 성과를 동시에 가진 유일한 소재입니다.'),
      note('고유 클릭은 사람 수라 중복이 제거되어 소재별 합(15,124)이 전체(14,570)와 다릅니다. 소재별 방문의 합(8,175)이 전체(8,084)보다 큰 것도 같은 이유로, 여러 소재를 거쳐 들어온 사용자가 각 소재에 계산되기 때문입니다.'),

      h2('확인용 — 대시보드와의 대조'),
      p(t('아래 값이 대시보드 1~3페이지에 표시되는 값과 같은지 확인하면 됩니다.', { color: GY })),
      p([t('1페이지  ', { bold: true }),
         t('노출 460,195 · 전체 링크클릭 17,828 · 고유 링크클릭 14,570 · 페이지 방문 8,084 · 예약 유도 90명 · 유도당 비용 ₫97,961 · 광고세트 business ₫69,696 vs family ₫174,238', { color: GY })]),
      p([t('2페이지  ', { bold: true }),
         t('링크 클릭 17,828 기준의 CTR·CPC·CPM (전체 클릭이 과금 단위이므로 고유 클릭으로 바꾸지 않습니다)', { color: GY })]),
      p([t('3페이지  ', { bold: true }),
         t('방문자 8,084명 · 세션 9,505 · 행동 방문자 150명 · CTA 110명 · 예약 유도 90명(106건) · 소재 순위는 방문 300명 이상에서만 비교', { color: GY })], { after: 0 }),
    ],
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(process.argv[2], buf);
  console.log('wrote', process.argv[2], buf.length, 'bytes');
});
