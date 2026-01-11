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

// Geocoding 쿼리 후보 생성 (우선순위대로)
export function getGeocodingQueries(location: LocationResult): string[] {
  const parts = location.parts;
  const queries: string[] = [];

  // 시/도 이름 정규화
  const normalizeCity = (name: string) =>
    name.replace(/(특별시|광역시|특별자치시|특별자치도|도)$/, "");

  if (parts.length >= 3) {
    // 3단계 (시-구-동): 여러 조합 시도
    const city = normalizeCity(parts[0]);
    queries.push(`${parts[2]}, ${parts[1]}, ${city}`); // 동, 구, 시
    queries.push(`${parts[1]}, ${city}`); // 구, 시
    queries.push(parts[1]); // 구만
    queries.push(city); // 시만
  } else if (parts.length === 2) {
    // 2단계 (시-구)
    const city = normalizeCity(parts[0]);
    queries.push(`${parts[1]}, ${city}`);
    queries.push(parts[1]);
    queries.push(city);
  } else {
    // 1단계 (시/도만)
    queries.push(normalizeCity(parts[0]));
    queries.push(parts[0]);
  }

  return queries;
}

// 첫 번째 쿼리 반환 (하위 호환성)
export function getLocationForGeocode(location: LocationResult): string {
  const queries = getGeocodingQueries(location);
  return queries[0] || location.name;
}
