// Every endpoint answers with the same JSON envelope so the frontend
// can unwrap response.data.data consistently.
export type ApiResult<T = undefined> = {
  code: number;
  status: "success" | "error";
  message?: string;
  data?: T;
  errors?: Array<{ path: string; message: string }>;
};

export function ok<T>(data: T, message?: string): ApiResult<T> {
  return { code: 200, status: "success", message, data };
}

export function created<T>(data: T, message?: string): ApiResult<T> {
  return { code: 201, status: "success", message, data };
}

export function fail(
  code: number,
  message: string,
  errors?: ApiResult["errors"],
): ApiResult {
  return { code, status: "error", message, errors };
}
