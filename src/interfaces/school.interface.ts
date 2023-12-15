export interface GetSchoolQuery {
  name: string;
  address: string;
}

export interface CreateSchool extends GetSchoolQuery {
  latitude: number;
  longitude: number;
}
