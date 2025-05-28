export class ApiError extends Error {
  data: any;
  constructor(message: string, data: any) {
    super(message);
    this.name = "ApiError";
    this.data = data;
  }
}
