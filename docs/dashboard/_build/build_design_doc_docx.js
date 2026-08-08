// 전체 대시보드 설계서 (1~3페이지) — Google Docs 업로드용 .docx
//
// 문체는 개조식. 색은 쓰지 않는다(검정·회색만). 표는 columnWidths 와 셀 width 를
// DXA 로 함께 지정한다 — PERCENTAGE 는 Google Docs 에서 열 폭이 무너진다.
// 목표 분량 2페이지.
const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, HeadingLevel, BorderStyle, ShadingType, PageBreak,
} = require('docx');

const FONT = '맑은 고딕';
const BK = '000000';
const GY = '595959';
const LN = 'BFBFBF';
const W = 9020;                      // A4(11906) - 좌우 여백(1440*2)

const THIN = { style: BorderStyle.SINGLE, size: 4, color: LN };

const t = (text, o = {}) => new TextRun({
  text, font: FONT, size: o.size || 18, bold: !!o.bold, color: o.color || BK,
});

const p = (runs, o = {}) => new Paragraph({
  children: Array.isArray(runs) ? runs : [runs],
  spacing: { before: o.before || 0, after: o.after == null ? 70 : o.after, line: o.line || 274 },
  indent: o.indent,
  border: o.rule ? { bottom: { style: BorderStyle.SINGLE, size: 6, color: LN } } : undefined,
});

const h1 = (text, sub) => [
  new Paragraph({
    children: [t(text, { size: 26, bold: true })],
    spacing: { after: 40 }, heading: HeadingLevel.HEADING_1,
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: BK } },
  }),
  ...(sub ? [p(t(sub, { size: 16, color: GY }), { after: 60 })] : []),
];

const h2 = (num, text) => new Paragraph({
  children: [t(num + '. ' + text, { size: 20, bold: true })],
  spacing: { before: 230, after: 90 }, heading: HeadingLevel.HEADING_2,
});

// 개조식 항목 한 줄
const li = (lead, rest) => p([
  t('- ', { color: GY }),
  ...(lead ? [t(lead, { bold: true })] : []),
  ...(rest ? [t(rest)] : []),
], { after: 45, indent: { left: 200, hanging: 200 } });

function row(cells, widths, o = {}) {
  return new TableRow({
    tableHeader: !!o.header,
    children: cells.map((c, i) => new TableCell({
      width: { size: widths[i], type: WidthType.DXA },
      shading: o.header ? { type: ShadingType.CLEAR, fill: 'F2F2F2', color: 'auto' } : undefined,
      margins: { top: 60, bottom: 60, left: 110, right: 110 },
      borders: { top: THIN, bottom: THIN, left: THIN, right: THIN },
      children: [new Paragraph({
        children: [t(c.text, { size: 16, bold: o.header || c.bold, color: c.color || (o.header ? BK : GY) })],
        spacing: { after: 0, line: 250 },
        alignment: c.align,
      })],
    })),
  });
}
const table = (widths, rows) => new Table({
  columnWidths: widths, width: { size: W, type: WidthType.DXA }, rows,
});

// ── 3페이지 역할 ─────────────────────────────────────────────────
const w1 = [1180, 1940, 1520, 4380];
const tbl1 = table(w1, [
  row([{ text: '페이지' }, { text: '핵심 질문' }, { text: '주 사용자' }, { text: '이 페이지로 내리는 결정' }], w1, { header: true }),
  row([
    { text: '1  종합 요약', bold: true, color: BK },
    { text: '"이번 캠페인, 돈값을 했나?"', bold: true, color: BK },
    { text: '마케팅 담당자' },
    { text: '캠페인 지속 여부와 예산 규모 판단' },
  ], w1),
  row([
    { text: '2  광고 성과', bold: true, color: BK },
    { text: '"어떤 광고에 돈을 쓸까?"', bold: true, color: BK },
    { text: '광고 운영 담당자' },
    { text: '소재·광고세트별 예산 재배분, 저효율 광고 중단' },
  ], w1),
  row([
    { text: '3  웹페이지 운영', bold: true, color: BK },
    { text: '"들어온 사람, 예약하려고 했나?"', bold: true, color: BK },
    { text: '웹페이지 운영 담당자' },
    { text: '첫 화면 메시지·CTA 배치 등 페이지 개선 지점 결정' },
  ], w1),
]);

// ── 운영 활용 ────────────────────────────────────────────────────
const w2 = [4300, 4720];
const cases = [
  ['전체 성과는 양호하나 특정 광고만 부진', '2페이지에서 소재별 성과 비교 후 예산 재배분'],
  ['광고 클릭은 많으나 랜딩페이지 행동이 적음', '3페이지에서 해당 소재 유입자의 행동 확인, 광고 메시지와 페이지 메시지의 일치 여부 점검'],
  ['방문자는 많으나 이후 행동이 거의 없음', '첫 화면 메시지·콘텐츠 구성·CTA 등 방문 직후 유도 요소 우선 점검'],
  ['CTA 클릭은 많으나 예약 의사 표현이 낮음', '예약 연결 방식과 CTA 목적지(메신저·전화 링크) 점검'],
  ['특정 시간대에 예약 의도 집중', '해당 시간대의 광고 노출과 고객 응대 인력 조정'],
];
const tbl2 = table(w2, [
  row([{ text: '상황' }, { text: '확인과 판단' }], w2, { header: true }),
  ...cases.map(([a, b]) => row([{ text: a, bold: true, color: BK }, { text: b }], w2)),
]);

const doc = new Document({
  styles: { default: { document: { run: { font: FONT, size: 18, color: BK } } } },
  sections: [{
    properties: { page: { margin: { top: 1000, bottom: 900, left: 1440, right: 1440 } } },
    children: [
      ...h1('마케팅 운영 대시보드 설계서',
        '하남돼지집 서호수점 · 2026-07-20 ~ 08-02 (14일) · Meta 광고 + 웹페이지 계측 · Tableau 구현'),

      h2('1', '제작 목적'),
      p(t('캠페인 결과 보고용 자료가 아니라, 담당자가 화면을 보고 다음 행동을 정하기 위한 도구.', { color: GY })),
      li('캠페인 전체 성과 확인 ', '— 집행한 예산이 어떤 결과로 이어졌는가'),
      li('광고 예산 판단 ', '— 어떤 광고에 더 쓰고, 어떤 광고를 줄일 것인가'),
      li('고객 행동 확인 ', '— 광고 유입자가 페이지에서 실제로 무엇을 했는가'),
      li('다음 운영 개선 ', '— 광고와 웹페이지에서 각각 무엇을 고칠 것인가'),

      h2('2', '주요 사용자'),
      p(t('하남돼지집 마케팅 담당자, 광고 운영 담당자, 웹페이지 운영 담당자. 데이터 분석 지식이 없어도 각 화면의 질문과 답을 바로 읽도록 구성. 지표 이름을 몰라도 무엇을 보고 무엇을 하면 되는지 화면에 문장으로 표기.', { color: GY })),

      h2('3', '세 페이지, 세 가지 질문'),
      p(t('가장 중요한 설계 원칙은 각 페이지가 서로 다른 질문 하나에만 답하도록 나눈 것.', { color: GY }), { after: 90 }),
      tbl1,
      p([t('2페이지는 광고 자체의 성과만 취급.', { bold: true }),
         t(' 상단 KPI에서 CTR·CPC·클릭·노출을 확인하고, 4분면 차트로 반응이 좋으면서 단가가 싼 소재를 위치로 선별한 뒤, 드릴다운으로 소재가 좋아서 성과가 난 것인지 좋은 자리에 나가서 난 것인지를 구분. 이 세 가지로 다음 캠페인의 예산 이동 방향을 결정.', { color: GY })],
        { before: 100 }),

      h2('4', '전체 흐름'),
      p([
        t('전체 성과 확인', { bold: true }), t('  →  ', { color: GY }),
        t('광고별 성과 비교', { bold: true }), t('  →  ', { color: GY }),
        t('웹페이지 행동 확인', { bold: true }), t('  →  ', { color: GY }),
        t('예약 의사 표현 확인', { bold: true }), t('  →  ', { color: GY }),
        t('다음 운영 개선', { bold: true }),
      ], { after: 70 }),
      p(t('1페이지에서 결과를 보고, 2페이지에서 그 결과를 만든 광고의 차이를 찾고, 3페이지에서 광고 이후 고객이 어떻게 움직였는지 확인하는 구조. 같은 지표를 두 화면에 중복 배치하지 않아 숫자가 어긋날 여지가 없음.', { color: GY }), { after: 0 }),

      new Paragraph({ children: [new PageBreak()] }),

      h2('5', '지표 선정 기준'),
      p(t('수집 가능한 데이터를 모두 넣지 않고, "이 숫자를 보고 내일 무엇을 바꿀 수 있는가"에 답할 수 있는 지표만 선별.', { color: GY })),
      li('남긴 것 ', '— 캠페인 전체 성과, 광고별 예산 배분 근거, 랜딩페이지 방문과 행동, 예약 의도, 다음 개선으로 이어지는 신호'),
      li('뺀 것 ', '— 다른 페이지와 중복되는 광고 지표, 운영 판단으로 이어지지 않는 세부 항목(OS·언어·메뉴 상세 등)'),
      p(t('3페이지의 핵심은 방문자 → 의미 있는 행동 → CTA 클릭 → 예약 유도로 이어지는 "방문 후 행동 흐름". 예약 유도 90명, 방문자 대비 1.11%라는 숫자만 보면 낮아 보이지만, 흐름과 함께 보면 사람들이 어느 행동 단계에서 멈추는지가 드러남. 이번 기간에는 방문 직후 단계에서 가장 많이 멈췄고, CTA를 누른 사람의 81.8%는 예약 의사를 표현하는 행동(예약 메시지 보내기·전화 걸기)까지 이어짐.', { color: GY }), { before: 70 }),
      p(t('화면은 기본적으로 한 장 유지. 소재별 성과표와 다음 운영 개선은 접어 두고 필요할 때 버튼으로 펼치는 방식. 매일 확인하는 화면에 글이 많으면 정작 봐야 할 숫자가 묻히기 때문.', { color: GY })),

      h2('6', '운영 활용'),
      tbl2,
      p(t('3페이지는 기간을 전체·1차·2차뿐 아니라 특정 하루만 골라 볼 수 있고, 하루를 고르면 전일 대비 변화가 함께 표시됨. 방문자와 세션은 변화율(%)로, 행동과 예약 유도는 사람 수 차이로 표시. 하루 예약 의사 표현이 1~12명 수준이라 비율 변화는 표본에 따라 크게 흔들리기 때문.', { color: GY }), { before: 100 }),
      p(t('데이터만으로 원인을 확정할 수 없는 경우 "문제 원인"이 아니라 "우선 점검 영역" 또는 "개선 가설"로 표현. 3페이지의 운영 체크포인트도 같은 원칙.', { color: GY })),

      h2('7', '측정 한계'),
      p(t('한계를 감추지 않고 해석 범위를 명시. 아래 내용은 화면 복잡도를 높이지 않기 위해 대시보드에는 넣지 않고 이 문서에만 기재.', { color: GY })),
      li('실제 예약 성사 여부 확인 불가. ', '예약 시스템과 연동되어 있지 않아 "예약 유도"는 예약 의사를 표현하는 버튼(예약 메시지 보내기·전화 걸기)을 누른 것까지. 버튼 문구가 Nhắn tin đặt bàn(테이블 예약 메시지 보내기)이라 의도는 분명하나, 실제 예약·방문·결제와 동일하게 해석하지 않음.'),
      li('메신저 전송 성공 여부 확인 불가. ', '버튼 클릭 이후 실제 메시지 발송 여부는 측정 범위 밖.'),
      li('페이지 내 이탈 지점 확인 불가. ', '스크롤 깊이 미계측. 이에 따라 퍼널을 "이탈 위치 분석"이 아니라 "방문 후 행동 흐름"으로 정의.'),
      li('Navigation 클릭은 이탈 위치가 아님. ', '특정 섹션으로 이동하려는 관심을 나타내는 보조 지표로만 사용.'),
      li('숫자는 사람 수. ', '방문자·행동·CTA·예약 유도 모두 고유 기기 기준. 클릭 횟수가 아니며 한 사람이 여러 번 눌러도 1명. 예약 유도 90명이 누른 횟수는 106건. 대시보드의 물음표 표시를 누르면 각 단계의 정의 확인 가능.'),

      h2('8', '한 문장 정의'),
      p(t('캠페인 성과부터 광고별 성과, 랜딩페이지에서의 고객 행동과 예약 의사 표현까지 하나로 이어 보여주어, 다음에 어디에 예산을 쓰고 무엇을 고칠지 바로 정할 수 있게 만든 마케팅 운영 대시보드.',
        { bold: true, size: 19 }), { after: 0 }),

      p(t('검증 · 방문자 8,084명 / 세션 9,505 / 의미 있는 행동 150명 / CTA 110명 / 예약 유도 90명 — 모두 고유 사용자 기준, 원본 집계와 일치',
        { size: 15, color: GY }), { before: 280, rule: true, after: 0 }),
    ],
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(process.argv[2], buf);
  console.log('wrote', process.argv[2], buf.length, 'bytes');
});
