import PolicyPage from "@/components/PolicyPage";

export default function Page() {
  return (
    <PolicyPage
      title="이메일무단수집거부"
      subtitle="본 사이트에 게시된 이메일 주소가 무단으로 수집되는 것을 거부합니다."
      updated="2026-07-03 (임시)"
      sections={[
        { body: [
          "본 웹사이트에 게시된 이메일 주소가 전자우편 수집 프로그램이나 그 밖의 기술적 장치를 이용하여 무단으로 수집되는 것을 거부하며, 이를 위반 시 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」에 의해 형사처벌될 수 있음을 알려드립니다.",
        ]},
        { h: "게시일", body: ["2026년 7월 3일 (임시)"] },
      ]}
    />
  );
}
