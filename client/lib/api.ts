import {
  StudentsResponse,
  StudentResponse,
  MarksResponse,
  MarksheetResponse,
  SubjectsResponse,
  ExamTypesResponse,
  ClassSectionsResponse,
  CreateStudentRequest,
  UpdateMarksRequest,
  GenerateMarksheetRequest,
  ApiResponse,
} from "@shared/types";

const API_BASE = "/api";

// Generic API function with error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}

// Students API
export const studentsApi = {
  getAll: (params?: {
    class?: string;
    section?: string;
    search?: string;
  }): Promise<StudentsResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.class) searchParams.append("class", params.class);
    if (params?.section) searchParams.append("section", params.section);
    if (params?.search) searchParams.append("search", params.search);

    const query = searchParams.toString();
    return apiRequest<StudentsResponse>(`/students${query ? `?${query}` : ""}`);
  },

  getById: (id: string): Promise<StudentResponse> =>
    apiRequest<StudentResponse>(`/students/${id}`),

  create: (student: CreateStudentRequest): Promise<StudentResponse> =>
    apiRequest<StudentResponse>("/students", {
      method: "POST",
      body: JSON.stringify(student),
    }),

  update: (id: string, student: Partial<CreateStudentRequest>) =>
    apiRequest<StudentResponse>(`/students/${id}`, {
      method: "PUT",
      body: JSON.stringify(student),
    }),

  delete: (id: string): Promise<StudentResponse> =>
    apiRequest<StudentResponse>(`/students/${id}`, {
      method: "DELETE",
    }),
};

// Class Sections API
export const classSectionsApi = {
  getAll: (): Promise<ClassSectionsResponse> =>
    apiRequest<ClassSectionsResponse>("/class-sections"),
};

// Subjects API
export const subjectsApi = {
  getAll: (): Promise<SubjectsResponse> =>
    apiRequest<SubjectsResponse>("/subjects"),
};

// Exam Types API
export const examTypesApi = {
  getAll: (): Promise<ExamTypesResponse> =>
    apiRequest<ExamTypesResponse>("/exam-types"),
};

// Marks API
export const marksApi = {
  getByClassSubject: (params: {
    className: string;
    section: string;
    subjectId: string;
    examTypeId: string;
  }): Promise<MarksResponse> => {
    const searchParams = new URLSearchParams(params);
    return apiRequest<MarksResponse>(`/marks?${searchParams.toString()}`);
  },

  getByStudent: (
    studentId: string,
    examTypeId?: string,
  ): Promise<MarksResponse> => {
    const params = new URLSearchParams();
    if (examTypeId) params.append("examTypeId", examTypeId);
    const query = params.toString();
    return apiRequest<MarksResponse>(
      `/marks/student/${studentId}${query ? `?${query}` : ""}`,
    );
  },

  update: (marks: UpdateMarksRequest[]): Promise<MarksResponse> =>
    apiRequest<MarksResponse>("/marks", {
      method: "POST",
      body: JSON.stringify(marks),
    }),

  delete: (params: {
    studentId: string;
    subjectId: string;
    examTypeId: string;
  }): Promise<ApiResponse<any>> => {
    const searchParams = new URLSearchParams(params);
    return apiRequest<ApiResponse<any>>(`/marks?${searchParams.toString()}`, {
      method: "DELETE",
    });
  },
};

// Marksheets API
export const marksheetsApi = {
  generate: (request: GenerateMarksheetRequest): Promise<MarksheetResponse> =>
    apiRequest<MarksheetResponse>("/marksheets/generate", {
      method: "POST",
      body: JSON.stringify(request),
    }),

  get: (params: {
    studentId: string;
    examTypeId: string;
    academicYear: string;
  }): Promise<MarksheetResponse> => {
    const searchParams = new URLSearchParams(params);
    return apiRequest<MarksheetResponse>(
      `/marksheets?${searchParams.toString()}`,
    );
  },

  generateBulk: (params: {
    className: string;
    section: string;
    examTypeId: string;
    academicYear: string;
  }): Promise<ApiResponse<any>> =>
    apiRequest<ApiResponse<any>>("/marksheets/bulk", {
      method: "POST",
      body: JSON.stringify(params),
    }),
};

// Dashboard API (for stats)
export const dashboardApi = {
  getStats: async () => {
    try {
      const [studentsRes, classSectionsRes] = await Promise.all([
        studentsApi.getAll(),
        classSectionsApi.getAll(),
      ]);

      if (!studentsRes.success || !classSectionsRes.success) {
        throw new Error("Failed to fetch dashboard data");
      }

      const totalStudents = studentsRes.data.length;
      const totalClasses = classSectionsRes.data.length;

      // Calculate some basic stats
      const classStats = classSectionsRes.data.map((cs) => {
        const classStudents = studentsRes.data.filter(
          (s) => s.class === cs.class && s.section === cs.section,
        );
        return {
          ...cs,
          actualStudentCount: classStudents.length,
        };
      });

      return {
        success: true,
        data: {
          totalStudents,
          totalClasses,
          classStats,
          averageClassSize: Math.round(totalStudents / totalClasses),
        },
      };
    } catch (error) {
      console.error("Dashboard stats error:", error);
      return {
        success: false,
        error: "Failed to fetch dashboard statistics",
      };
    }
  },
};
