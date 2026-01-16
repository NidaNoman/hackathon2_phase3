// frontend/src/lib/api.ts
// T018: Setup frontend API client for backend communication

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

async function request<T>(
  method: string,
  path: string,
  data?: any,
  authenticated: boolean = false
): Promise<T> {
  let requestBody: BodyInit | undefined;
  const requestHeaders: HeadersInit = {};

  if (data instanceof URLSearchParams) {
    // For form-urlencoded data (e.g., OAuth2PasswordRequestForm)
    requestBody = data;
    requestHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
  } else if (data) {
    // For JSON data
    requestBody = JSON.stringify(data);
    requestHeaders['Content-Type'] = 'application/json';
  }

  // Add Authorization header if authenticated
  if (authenticated) {
    const token = localStorage.getItem('accessToken'); // Retrieve token from localStorage
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
      console.log(`Sending request to ${path} with Authorization: Bearer ${token.substring(0, 10)}...`); // Log for debugging
    } else {
      console.warn('Attempted to make authenticated request without a token in localStorage.');
      throw new Error('Authentication required: No access token found. Please log in.');
    }
  }

  const config: RequestInit = {
    method,
    headers: requestHeaders, // Use the dynamically created headers
    body: requestBody,
    // Removed 'credentials' option as we are using explicit Authorization header from localStorage.
    // This is primarily relevant for cookie-based authentication.
  };

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, config);

    if (!response.ok) {
      let errorBody: any;
      try {
        errorBody = await response.json();
      } catch {
        // If response is not JSON, try to read as text
        errorBody = await response.text();
      }

      let errorMessage = 'Something went wrong';

      if (typeof errorBody === 'string') {
          errorMessage = `Server responded with: ${response.status} ${response.statusText} - ${errorBody}`;
      } else if (errorBody && Array.isArray(errorBody.detail)) {
        // FastAPI validation errors format (array of objects with 'msg' field)
        errorMessage = errorBody.detail.map((err: any) => err.msg).join('; ');
      } else if (errorBody && typeof errorBody.detail === 'string') {
        // Other FastAPI errors (e.g., HTTPException with a string detail)
        errorMessage = errorBody.detail;
      } else if (errorBody && errorBody.message) {
        // Generic error message if available
        errorMessage = errorBody.message;
      } else {
          errorMessage = `Server responded with: ${response.status} ${response.statusText}`;
      }

      throw new Error(errorMessage);
    }

    // Handle cases where response might not have a body (e.e., 204 No Content)
    if (response.status === 204) {
        return {} as T;
    }

    return await response.json() as T;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

export const api = {
  get: <T>(path: string, authenticated: boolean = false) => request<T>('GET', path, undefined, authenticated),
  post: <T>(path: string, data: any, authenticated: boolean = false) => request<T>('POST', path, data, authenticated),
  put: <T>(path: string, data: any, authenticated: boolean = false) => request<T>('PUT', path, data, authenticated),
  delete: <T>(path: string, authenticated: boolean = false) => request<T>('DELETE', path, undefined, authenticated),
};
