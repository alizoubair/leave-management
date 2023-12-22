
  export interface Holiday {
    id: number;
    holiday_date: Date;
    description: string;
  }

  export interface HolidayRespo {
    status: number;
    message: string;
    total: number;
    data: Holiday[];
  }
