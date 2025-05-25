declare namespace API {
  export interface IAuthenticateParams {
    userName: string;
    password: string;
  }
  export interface IRefreshTokenParams {
    accessToken: string;
    refreshToken: string;
  }
  export interface IResponse<T> {
    data: T;
    errorCode?: string;
    message?: string;
    success?: boolean;
    stateCode?: number;
  }
  export interface IPaging<T> {
    firstItemOnPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    isFirstPage: boolean;
    isLastPage: boolean;
    items: T[];
    pageCount: number;
    totalItemCount: number;
  }
  export interface IListResponse<T> {
    data: T[];
  }
  export interface IChangePassword {
    userName: string;
    oldPassword: string;
    newPassword: string;
  }
  export interface IResponseAPI<T = any> {
    data: T;
    statusCode: number;
    success: boolean;
    errors: [
      {
        errorCode: string;
        errorMessage: string;
        propertyName: string;
      },
    ];
  }
  export interface IResponseSearch<T = any> {
    data: T[];
    pagination: {
      limit: number;
      currentPage: number;
      totalPages: number;
      totalRecords: number;
    };
  }
}
