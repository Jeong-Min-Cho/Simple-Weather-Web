import koreaDistricts from "@/shared/data/korea-districts.json";

export interface LocationResult {
  id: string;
  name: string;
  fullName: string;
  parts: string[];
}

// 지역 데이터를 파싱하여 검색 가능한 형태로 변환
function parseLocations(): LocationResult[] {
  return koreaDistricts.map((location, index) => {
    const parts = location.split("-");
    const name = parts[parts.length - 1]; // 마지막 부분 (동/읍/면/구/시)

    return {
      id: `loc-${index}`,
      name,
      fullName: parts.join(" "), // "서울특별시 종로구 청운동"
      parts,
    };
  });
}

const locations = parseLocations();

// 검색어로 지역 검색
export function searchLocations(query: string, limit: number = 10): LocationResult[] {
  if (!query || query.length < 1) {
    return [];
  }

  const normalizedQuery = query.trim().toLowerCase();

  // 검색 결과 (이름 또는 전체 주소에 검색어가 포함된 경우)
  const results = locations.filter((location) => {
    const fullNameLower = location.fullName.toLowerCase();
    const nameLower = location.name.toLowerCase();

    return nameLower.includes(normalizedQuery) || fullNameLower.includes(normalizedQuery);
  });

  // 정확도 순 정렬: 이름이 검색어로 시작하는 경우 우선
  results.sort((a, b) => {
    const aStartsWith = a.name.toLowerCase().startsWith(normalizedQuery);
    const bStartsWith = b.name.toLowerCase().startsWith(normalizedQuery);

    if (aStartsWith && !bStartsWith) return -1;
    if (!aStartsWith && bStartsWith) return 1;

    // 같은 경우 짧은 이름 우선
    return a.fullName.length - b.fullName.length;
  });

  return results.slice(0, limit);
}

// 검색어로 가장 적합한 지역 찾기 (geocoding용)
export function getLocationForGeocode(location: LocationResult): string {
  // 시/군/구 레벨까지만 사용 (동 레벨은 geocoding에서 잘 안됨)
  if (location.parts.length >= 2) {
    return location.parts.slice(0, 2).join(" ");
  }
  return location.parts[0];
}
