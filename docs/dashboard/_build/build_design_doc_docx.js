// 전체 대시보드 설계서 (1~3페이지) — Google Docs 업로드용 .docx
// A4 세로, 본문 맑은 고딕. 표는 columnWidths + 셀 width 를 DXA 로 같이 지정한다
// (PERCENTAGE 는 Google Docs 에서 깨진다). 목표 분량 2페이지.
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
const W = 9020;                      // A4(11906) - 좌우 여백(1440*2)

const THIN = { style: BorderStyle.SINGLE, size: 4, color: LG };

const t = (text, o = {}) => new TextRun({
  text, font: FONT, size: o.size || 18, bold: !!o.bold, color: o.color || C100,
});

const p = (runs, o = {}) => new Paragraph({
  children: Array.isArray(runs) ? runs : [runs],
  spacing: { before: o.before || 0, after: o.after == null ? 70 : o.after, line: o.line || 276 },
  alignment: o.align,
  indent: o.indent,
  border: o.rule ? { bottom: { style: BorderStyle.SINGLE, size: 6, color: o.rule } } : undefined,
});

const h1 = (text, sub) => [
  new Paragraph({
    children: [t(text, { size: 28, bold: true })],
    spacing: { after: 40 }, heading: HeadingLevel.HEADING_1,
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: RED } },
  }),
  ...(sub ? [p(t(sub, { size: 17, color: C70 }), { after: 60 })] : []),
];

const h2 = (num, text) => new Paragraph({
  children: [t(num + '. ', { size: 21, bold: true, color: RED }), t(text, { size: 21, bold: true })],
  spacing: { before: 240, after: 100 }, heading: HeadingLevel.HEADING_2,
});

const bullet = (lead, rest) => p([
  t('· ', { color: RED, bold: true }),
  ...(lead ? [t(lead, { bold: true })] : []),
  ...(rest ? [t(rest, { color: C70 })] : []),
], { after: 50, indent: { left: 160, hanging: 160 } });

function row(cells, widths, o = {}) {
  return new TableRow({
    tableHeader: !!o.header,
    children: cells.map((c, i) => new TableCell({
      width: { size: widths[i], type: WidthType.DXA },
      shading: o.header ? { type: ShadingType.CLEAR, fill: 'F5F5F2', color: 'auto' }
        : (o.fill ? { type: ShadingType.CLEAR, fill: o.fill, color: 'auto' } : undefined),
      margins: { top: 60, bottom: 60, left: 110, right: 110 },
      borders: { top: THIN, bottom: THIN, left: THIN, right: THIN },
      children: [new Paragraph({
        children: [t(c.text, {
          size: o.header ? 16 : (c.size || 16),
          bold: o.header || c.bold,
          color: o.header ? C45 : (c.color || C70),
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

// ── 3페이지 역할 표 ────────────────────────────────────────────────
const w1 = [1180, 1900, 1560, 4380];
const tbl1 = table(w1, [
  row([{ text: '페이지' }, { text: '핵심 질문' }, { text: '주 사용자' }, { text: '이 페이지로 내리는 결정' }], w1, { header: true }),
  row([
    { text: '1  종합 요약', bold: true, color: C100 },
    { text: '"이번 캠페인, 돈값을 했나?"', bold: true, color: C100 },
    { text: '마케팅 담당자' },
    { text: '캠페인을 계속할지, 예산 규모를 늘릴지 줄일지 판단' },
  ], w1),
  row([
    { text: '2  광고 성과', bold: true, color: C100 },
    { text: '"어떤 광고에 돈을 쓸까?"', bold: true, color: C100 },
    { text: '광고 운영 담당자' },
    { text: '소재·광고세트별로 예산을 옮기고, 저효율 광고를 중단' },
  ], w1),
  row([
    { text: '3  웹페이지 운영', bold: true, color: RED },
    { text: '"들어온 사람, 예약까지 갔나?"', bold: true, color: C100 },
    { text: '웹페이지 운영 담당자' },
    { text: '첫 화면 메시지·CTA 배치 등 페이지에서 고칠 곳을 결정' },
  ], w1, { fill: 'FFF6F7' }),
]);

// ── 활용 예시 표 ──────────────────────────────────────────────────
const w2 = [4380, 4640];
const cases = [
  ['전체 성과는 괜찮은데 특정 광고만 부진하다', '2페이지에서 소재별 성과를 비교하고 예산을 재배분'],
  ['광고 클릭은 많은데 랜딩페이지 행동이 적다', '3페이지에서 그 소재로 들어온 사람의 행동을 확인하고, 광고 메시지와 페이지 메시지가 어긋나지 않는지 점검'],
  ['방문자는 많은데 이후 행동이 거의 없다', '첫 화면 메시지·콘텐츠 구성·CTA 등 방문 직후 유도 요소를 우선 점검'],
  ['CTA 클릭은 많은데 예약 유도가 낮다', '예약 연결 방식과 CTA 목적지(메신저·전화 링크)를 점검'],
  ['특정 시간대에 예약 의도가 몰린다', '그 시간대에 광고 노출과 고객 응대 인력을 맞춤'],
];
const tbl2 = table(w2, [
  row([{ text: '이런 상황이라면' }, { text: '이렇게 확인하고 판단합니다' }], w2, { header: true }),
  ...cases.map(([a, b]) => row([
    { text: a, bold: true, color: C100 }, { text: '→ ' + b },
  ], w2)),
]);

const doc = new Document({
  styles: { default: { document: { run: { font: FONT, size: 18, color: C100 } } } },
  sections: [{
    properties: { page: { margin: { top: 1000, bottom: 900, left: 1440, right: 1440 } } },
    children: [
      ...h1('마케팅 운영 대시보드 설계서',
        '하남돼지집 서호수점  ·  2026-07-20 ~ 08-02 (14일)  ·  Meta 광고 + 웹페이지 계측  ·  구현 Tableau'),

      h2('1', '무엇을 위해 만들었나'),
      p(t('이 대시보드는 캠페인 결과를 보고하기 위한 자료가 아닙니다. 담당자가 화면을 보고 곧바로 다음 행동을 정할 수 있도록 만들었습니다.', { color: C70 })),
      bullet('캠페인 전체 성과 확인 — ', '이번에 쓴 돈이 어떤 결과로 돌아왔는가'),
      bullet('광고 예산 판단 — ', '어떤 광고에 더 쓰고, 어떤 광고를 줄일 것인가'),
      bullet('고객 행동 확인 — ', '광고를 보고 들어온 사람이 페이지에서 실제로 무엇을 했는가'),
      bullet('다음 운영 개선 — ', '광고와 웹페이지에서 각각 무엇을 고칠 것인가'),

      h2('2', '누가 보는 화면인가'),
      p(t('하남돼지집 마케팅 담당자, 광고 운영 담당자, 웹페이지 운영 담당자가 사용합니다. 데이터 분석을 따로 배우지 않아도 각 화면의 질문과 답이 바로 읽히도록 설계했습니다. 지표 이름을 몰라도 "무엇을 보고 무엇을 하면 되는지"가 화면 안에 문장으로 적혀 있습니다.', { color: C70 })),

      h2('3', '세 페이지, 세 가지 질문'),
      p(t('가장 중요한 설계 원칙은 각 페이지가 서로 다른 질문 하나에만 답하도록 나눈 것입니다.', { color: C70 }), { after: 100 }),
      tbl1,

      h2('4', '세 페이지가 이어지는 하나의 흐름'),
      p([
        t('전체 성과 확인', { bold: true }), t('  →  ', { color: C45 }),
        t('광고별 성과 비교', { bold: true }), t('  →  ', { color: C45 }),
        t('웹페이지 행동 확인', { bold: true }), t('  →  ', { color: C45 }),
        t('예약 유도 확인', { bold: true }), t('  →  ', { color: C45 }),
        t('다음 운영 개선', { bold: true, color: RED }),
      ], { after: 80 }),
      p(t('1페이지에서 결과를 보고, 2페이지에서 그 결과를 만든 광고의 차이를 찾고, 3페이지에서 광고 이후 고객이 실제로 어떻게 움직였는지 확인하는 구조입니다. 같은 지표를 두 화면에 두지 않아, 숫자가 어긋날 일이 없습니다.', { color: C70 }), { after: 0 }),

      new Paragraph({ children: [new PageBreak()] }),

      h2('5', '지표는 이렇게 골랐습니다'),
      p(t('수집할 수 있는 데이터를 모두 넣지 않았습니다. "이 숫자를 보고 내일 무엇을 바꿀 수 있는가"에 답할 수 있는 지표만 남겼습니다.', { color: C70 })),
      bullet('남긴 것 — ', '캠페인 전체 성과, 광고별 예산 배분 근거, 랜딩페이지 방문과 행동, 예약 의도, 다음 개선으로 이어지는 신호'),
      bullet('뺀 것 — ', '다른 페이지와 겹치는 광고 지표, 운영 판단으로 이어지지 않는 세부 항목(OS·언어·메뉴 상세 등)'),
      p(t('특히 3페이지의 핵심은 방문자 → 의미 있는 행동 → CTA 클릭 → 예약 유도로 이어지는 "방문 후 행동 흐름"입니다. 예약 유도율 1.11%라는 숫자만 보면 낮아 보이지만, 흐름과 함께 보면 어느 구간에서 사람이 빠지는지가 드러납니다. 이번 기간에는 방문 직후 구간의 손실이 가장 컸고, CTA를 누른 사람의 81.8%는 예약 문의까지 이어졌습니다.', { color: C70 }), { before: 80 }),

      h2('6', '실제로 이렇게 씁니다'),
      tbl2,
      p(t('데이터만으로 원인을 확정할 수 없을 때는 "문제 원인"이라고 쓰지 않고 "우선 점검 영역" 또는 "개선 가설"로 표현합니다. 3페이지의 운영 체크포인트도 같은 원칙으로 씌어 있습니다.', { color: C70 }), { before: 100 }),

      h2('7', '이 대시보드가 말할 수 없는 것'),
      p(t('한계를 감추지 않고 해석 범위를 분명히 했습니다. 아래 내용은 화면을 복잡하게 만들지 않기 위해 대시보드에는 넣지 않고 이 문서에만 적습니다.', { color: C70 })),
      bullet('실제 예약 성사 여부는 알 수 없습니다. ', '예약 시스템과 연동되어 있지 않아, "예약 유도"는 메신저 문의 또는 전화 걸기 버튼을 누른 것까지입니다. 실제 예약·방문·결제와 같은 뜻으로 읽지 않습니다.'),
      bullet('메신저 전송 성공 여부는 확인할 수 없습니다. ', '버튼을 누른 뒤 실제로 메시지를 보냈는지는 측정 범위 밖입니다.'),
      bullet('페이지의 어느 지점에서 이탈했는지는 알 수 없습니다. ', '스크롤 깊이를 측정하지 않았습니다. 그래서 퍼널을 "이탈 위치 분석"이 아니라 "방문 후 행동 흐름"으로 정의했습니다.'),
      bullet('Navigation 클릭은 이탈 위치가 아닙니다. ', '특정 섹션으로 이동하려는 관심을 나타내는 보조 지표로만 사용합니다.'),

      h2('8', '한 문장으로'),
      p([t('캠페인 성과부터 광고별 성과, 랜딩페이지에서의 고객 행동과 예약 유도까지 하나로 이어 보여주어, 다음에 어디에 예산을 쓰고 무엇을 고칠지 바로 정할 수 있게 만든 마케팅 운영 대시보드.',
        { bold: true, size: 19 })], { after: 0 }),

      p(t('검증 · 방문자 8,084 / 세션 9,505 / 의미 있는 행동 150 / CTA 110 / 예약 유도 90 — 원본 집계와 일치',
        { size: 15, color: C45 }), { before: 300, rule: LG, after: 0 }),
    ],
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(process.argv[2], buf);
  console.log('wrote', process.argv[2], buf.length, 'bytes');
});
