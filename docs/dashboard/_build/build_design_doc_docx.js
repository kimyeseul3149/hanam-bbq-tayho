// 대시보드 설계서 — Google Docs 업로드용 .docx
// A4 세로, 본문 맑은 고딕. 표는 columnWidths + 셀 width 를 DXA 로 같이 지정한다
// (PERCENTAGE 는 Google Docs 에서 깨진다).
const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, HeadingLevel, BorderStyle, ShadingType, PageBreak,
} = require('docx');

const FONT = '맑은 고딕';
const RED = 'E60012';
const C100 = '1A1A1A';
const C70 = '616161';
const C45 = '939393';
const LG = 'E9E9E9';
const W = 9020;                      // A4(11906) - 좌우 여백(1440*2) 에 맞춘 표 폭

const NO_BORDER = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const THIN = { style: BorderStyle.SINGLE, size: 4, color: LG };

const t = (text, o = {}) => new TextRun({
  text, font: FONT, size: o.size || 19, bold: !!o.bold,
  color: o.color || C100, italics: !!o.italics,
});

const p = (runs, o = {}) => new Paragraph({
  children: Array.isArray(runs) ? runs : [runs],
  spacing: { before: o.before || 0, after: o.after == null ? 80 : o.after, line: o.line || 280 },
  alignment: o.align,
  border: o.rule ? { bottom: { style: BorderStyle.SINGLE, size: 6, color: o.rule } } : undefined,
  indent: o.indent,
});

const h1 = (text) => new Paragraph({
  children: [t(text, { size: 30, bold: true })],
  spacing: { after: 60 }, heading: HeadingLevel.HEADING_1,
  border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: RED } },
});

const h2 = (num, text, note) => new Paragraph({
  children: [
    t(num + '. ', { size: 22, bold: true, color: RED }),
    t(text, { size: 22, bold: true }),
    ...(note ? [t('   ' + note, { size: 17, color: C45 })] : []),
  ],
  spacing: { before: 260, after: 110 }, heading: HeadingLevel.HEADING_2,
});

// 표 한 줄. cells = [{text, bold, color, align}]
function row(cells, widths, o = {}) {
  return new TableRow({
    tableHeader: !!o.header,
    children: cells.map((c, i) => new TableCell({
      width: { size: widths[i], type: WidthType.DXA },
      shading: o.header
        ? { type: ShadingType.CLEAR, fill: 'F5F5F2', color: 'auto' }
        : (o.fill ? { type: ShadingType.CLEAR, fill: o.fill, color: 'auto' } : undefined),
      margins: { top: 70, bottom: 70, left: 110, right: 110 },
      borders: { top: THIN, bottom: THIN, left: THIN, right: THIN },
      children: [new Paragraph({
        children: [t(c.text, {
          size: o.header ? 16 : (c.size || 17),
          bold: o.header || c.bold,
          color: o.header ? C45 : (c.color || C70),
        })],
        spacing: { after: 0, line: 260 },
        alignment: c.align,
      })],
    })),
  });
}

const table = (widths, rows) => new Table({
  columnWidths: widths,
  width: { size: W, type: WidthType.DXA },
  rows,
});

// ── 1. 페이지 역할 ────────────────────────────────────────────────
const w1 = [1500, 1500, 2600, 3420];
const tbl1 = table(w1, [
  row([{ text: '페이지' }, { text: '보는 사람' }, { text: '답하는 질문' }, { text: '무엇을 담나' }], w1, { header: true }),
  row([
    { text: '1  종합 요약', bold: true, color: C100 },
    { text: '의사결정자' },
    { text: '"이번 캠페인, 돈값을 했나?"', bold: true, color: C100 },
    { text: '광고비 → 클릭 → 방문 → 예약 유도 → 유도당 비용' },
  ], w1),
  row([
    { text: '2  Meta 광고 운영', bold: true, color: C100 },
    { text: '광고 운영자' },
    { text: '"어떤 광고에 돈을 더 쓸까?"', bold: true, color: C100 },
    { text: '노출 · CTR · CPC · 지면 · 소재별 성과' },
  ], w1),
  row([
    { text: '3  웹페이지 운영', bold: true, color: RED },
    { text: '웹페이지 운영자' },
    { text: '"들어온 사람이 예약까지 갔나?"', bold: true, color: C100 },
    { text: '방문 → 페이지 내 행동 → CTA 클릭 → 예약 유도' },
  ], w1, { fill: 'FFF6F7' }),
]);

// ── 2. 퍼널 ───────────────────────────────────────────────────────
const w2 = [1180, 4340, 1100, 1200, 1200];
const fn = [
  ['1  방문자', '랜딩페이지가 열린 사람 (고유 기기 기준 · 로그인 없음)', '8,084명', '100.0%', '—'],
  ['2  클릭', '화면 어디든 눌러본 사람 — 반응 없는 곳을 눌러도 포함', '396명', '4.9%', '4.9%'],
  ['3  행동', '메뉴 열기 · 탭 전환처럼 페이지가 실제로 반응한 조작', '150명', '1.9%', '37.9%'],
  ['4  CTA', '예약 관련 버튼 5종 중 하나를 누른 사람', '110명', '1.4%', '73.3%'],
  ['5  예약 유도', '메신저 문의 또는 전화 걸기를 누른 사람', '90명', '1.1%', '81.8%'],
];
const tbl2 = table(w2, [
  row([{ text: '단계' }, { text: '어떻게 세나' }, { text: '인원' }, { text: '방문자 대비' }, { text: '직전 단계 대비' }], w2, { header: true }),
  ...fn.map(([a, b, c, d, e], i) => row([
    { text: a, bold: true, color: i === 4 ? RED : C100 },
    { text: b },
    { text: c, bold: true, color: i === 4 ? RED : C100, align: AlignmentType.RIGHT },
    { text: d, align: AlignmentType.RIGHT },
    { text: e, bold: i > 0, color: i > 0 ? C100 : C45, align: AlignmentType.RIGHT },
  ], w2, i === 4 ? { fill: 'FFF6F7' } : {})),
]);

// ── 4. 화면 구성 ──────────────────────────────────────────────────
const w4 = [620, 2260, 3200, 2940];
const secs = [
  ['1', '전체 운영 성과는 어땠나?', '방문자 8,084 · 세션 9,505 · 행동률 1.86% · 예약 유도율 1.11% (90건)', '이번 기간 성적을 한 줄로 확인'],
  ['2', '어떤 광고로 들어왔고, 어디까지 갔나?', '광고 세트별 예약 유도율 · 랜딩페이지 행동 퍼널 5단계(단계별 이탈·전환)', '어느 구간에서 사람이 빠지는지 특정'],
  ['3', '무엇을, 어디에서 눌렀나?', 'CTA 종류(메신저 56 · 전화 38 · 길찾기 12) · CTA 위치(hero 62 · floating 36 · header 12)', '잘 눌리는 버튼·위치는 강화, 안 눌리는 곳은 개선'],
  ['4', '언제 예약 의도가 발생했나?', '요일 × 시간 히트맵 (기본값 예약 유도 · 방문 · CTA 전환 가능)', '예약이 몰리는 시간대에 응대·광고 집중'],
  ['5', '어떤 광고 유입이 예약을 만들었나?', '소재별 방문자 · 행동 · 행동률 · CTA · 예약 유도 · 유도율', '잘 되는 소재로 예산 이동, 저효율 소재 중단'],
];
const tbl4 = table(w4, [
  row([{ text: '영역' }, { text: '이 영역이 답하는 질문' }, { text: '무엇을 보나' }, { text: '어떤 판단을 하나' }], w4, { header: true }),
  ...secs.map(([n, q, w, a], i) => row([
    { text: n, bold: true, color: i === 4 ? RED : C100, align: AlignmentType.CENTER },
    { text: q, bold: true, color: C100 },
    { text: w },
    { text: '→ ' + a, color: C100 },
  ], w4, i === 4 ? { fill: 'FFF6F7' } : {})),
]);

const prin = [
  ['중복은 한 번만', '노출 · CTR · CPC · 광고비는 2페이지에만 둡니다. 같은 숫자가 두 화면에 있으면 어느 쪽이 맞는지 확인하는 시간이 듭니다.'],
  ['움직일 수 있는 것만', '"이 숫자를 보고 내일 무엇을 바꿀 수 있는가"에 답하지 못하는 지표는 뺐습니다. OS 분포 · 언어 · 메뉴 항목이 여기에 해당합니다.'],
  ['모르는 건 모른다고', '측정하지 않은 것은 화면에 한계를 적습니다. 추정치를 확정치처럼 보여주는 것이 가장 위험합니다.'],
];

const doc = new Document({
  styles: { default: { document: { run: { font: FONT, size: 19, color: C100 } } } },
  sections: [{
    properties: { page: { margin: { top: 1000, bottom: 1000, left: 1440, right: 1440 } } },
    children: [
      h1('대시보드 설계서'),
      p([
        t('하남돼지집 서호수점  ·  ', { size: 18, color: C70 }),
        t('2026-07-20 ~ 08-02 (14일)', { size: 18, color: C70 }),
        t('  ·  Amplitude 웹 계측 + Meta 광고 실적  ·  구현 Tableau', { size: 18, color: C70 }),
      ], { after: 40 }),

      h2('1', '세 페이지, 세 가지 질문', '보는 사람도 답도 다르기 때문에 나눴습니다'),
      tbl1,

      h2('2', '3페이지가 따라가는 하나의 흐름', '광고를 클릭해 들어온 8,084명이 어디까지 갔는가'),
      tbl2,
      p([t('가장 큰 손실은 1 → 2 구간입니다. 방문자의 95.1%가 아무것도 누르지 않고 나갔습니다. ', { size: 17, color: C70 }),
         t('4 → 5 는 81.8%로 가장 안정적입니다 — 버튼까지 온 사람은 대부분 예약 문의로 이어집니다.', { size: 17, color: C70 })],
        { before: 90, after: 0 }),

      h2('3', '세 가지 설계 원칙', '무엇을 넣을지가 아니라 무엇을 뺄지로 정했습니다'),
      ...prin.flatMap(([k, v]) => [
        p([t('■ ', { size: 17, color: RED }), t(k, { bold: true, size: 19 })], { after: 20 }),
        p(t(v, { size: 17, color: C70 }), { after: 110, indent: { left: 200 } }),
      ]),

      new Paragraph({ children: [new PageBreak()] }),

      h1('3페이지 — 웹페이지 운영 대시보드'),
      p(t('위에서 아래로 읽으면 다섯 개 질문에 순서대로 답이 나옵니다.', { size: 18, color: C70 }), { after: 40 }),

      h2('4', '화면 구성과 읽는 순서', '각 영역은 "이 데이터를 보고 실제로 무엇을 할 수 있는가"로 남길지 정했습니다'),
      tbl4,

      h2('5', '이 대시보드가 말할 수 없는 것', '한계를 화면에도 함께 적어 둡니다'),
      p([t('실제 예약 성사 여부는 알 수 없습니다. ', { bold: true }),
         t('예약 시스템(POS)과 연동되어 있지 않아 90건은 "문의 버튼을 눌렀다"까지입니다. 상한선으로 읽어야 합니다.', { color: C70 })],
        { after: 100 }),
      p([t('측정 한계 — ', { bold: true }),
         t('스크롤 Depth 미계측으로 정확한 이탈 구간은 확인할 수 없습니다. Navigation Click은 특정 섹션으로 ', { color: C70 }),
         t('이동하려는 행동', { bold: true }),
         t('을 의미하며 ', { color: C70 }),
         t('이탈 위치를 의미하지 않습니다.', { bold: true })],
        { after: 100 }),
      p([t('Dead Click · Rage Click · Navigation', { bold: true }),
         t('은 우측 하단 보조 지표 영역에만 두고, 핵심 흐름을 가리지 않게 했습니다. OS · 언어 · 메뉴 상세는 별도 상세 대시보드에서 확인합니다.', { color: C70 })],
        { after: 100 }),
      p([t('직접 유입 40명', { bold: true }),
         t('은 소재별 성과 표에서 제외했습니다. 광고를 통하지 않은 방문이라 소재 성과로 볼 수 없습니다.', { color: C70 })],
        { after: 0 }),

      p([t('검증 · 방문자 8,084 / 세션 9,505 / 행동 150 / CTA 110 / 예약 유도 90 — 원본 집계와 일치', { size: 16, color: C45 })],
        { before: 300, rule: LG, after: 0 }),
    ],
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(process.argv[2], buf);
  console.log('wrote', process.argv[2], buf.length, 'bytes');
});
