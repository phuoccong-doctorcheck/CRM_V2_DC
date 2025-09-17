export  const months = [
  { value: 1, label: 'Tháng 1' },
  { value: 2, label: 'Tháng 2' },
  { value: 3, label: 'Tháng 3' },
  { value: 4, label: 'Tháng 4' },
  { value: 5, label: 'Tháng 5' },
  { value: 6, label: 'Tháng 6' },
  { value: 7, label: 'Tháng 7' },
  { value: 8, label: 'Tháng 8' },
  { value: 9, label: 'Tháng 9' },
  { value: 10, label: 'Tháng 10' },
  { value: 11, label: 'Tháng 11' },
  { value: 12, label: 'Tháng 12' },
];
export const growthPercent = Array.from({ length: 20 }, (_, index) => {
  const value = (index + 1) * 5;
  return {
    value: value / 100,
    label: `${value}%`,
  };
});

export const dataS = [
           {
    key: '1',
    name: '1. Doanh Thu Dự Kiến',
    price: [200000000,21000000000],
    children: [
      {
        key: '1-1',
        name: '1.1 Doctor Check Cá Nhân',
        price: [300000,31000000,1000],
        children: [
          {
            key: '1-1-1',
            name: '1.1.1 Gói Nam',
            price: 20000000,
          },
          {
            key: '1-1-2',
            name: '1.1.2 Gói Nữ',
            price: 20000000,
          },
           {
            key: '1-1-3',
            name: '1.1.3 Gói Lẻ',
            price: 20000000,
          },
         
          {
            key: '1-1-4',
            name: '1.1.4 Dịch Vụ Lẻ',
            price: 30000000,
            children: [
              {
                key: '1-1-4-1',
                name: '1.1.4.1 Xét Nghiệm ',
                price: 40000000,
              },
              {
                key: '1-1-4-2',
                name: '1.1.4.2 Chẩn Đoán Hình Ảnh',
                price: 50000000,
              },
               {
               key: '1-1-4-3',
                name: '1.1.4.3 Thăm Dò Chức Năng',
                price: 50000000,
              },
              {
                key: '1-1-4-4',
                name: '1.1.4.4 Nội Soi',
                price: 60000000,
                children: [
                  {
                    key: '1-1-4-4-1',
                    name: '1.1.4.4.1 Dạ Dày',
                    price: 70000000,
                  },
                  {
                    key: '1-1-4-4-2',
                    name: '1.1.4.4.2 Đại Tràng',
                    price: 70000000,
                  },
                  {
                    key: '1-1-4-4-3',
                    name: '1.1.4.4.3 Trực Tràng',
                    price: 70000000,
                  },
                  {
                    key: '1-1-4-4-4',
                    name: '1.1.4.4.4 Thủ Thuật Nội Soi',
                    price: 70000000,
                  },
                  {
                    key: '1-1-4-4-5',
                    name: '1.1.4.4.5 Vật Tư Y Tế ',
                    price: 70000000,
                  },
                ],
              },
                {
               key: '1-1-4-5',
                name: '1.1.4.5 Khám Lâm Sàng',
                price: 50000000,
              },
            ],
          },
           {
            key: '1-1-5',
            name: '1.1.5 Thuốc',
            price: 30000000,
            children: [
              {
                key: '1-1-5-1',
                name: '1.1.5.1 Thuốc Bảo Hiểm',
                price: 40000000,
              },
               {
                key: '1-1-5-2',
                name: '1.1.5.2 Thuốc Dịch Vụ',
                price: 40000000,
              },
            ],
          },
        ],
      },
       {
        key: '1-2',
        name: '1.2 Doanh Nghiệp',
        price: 10000000,
        children: [
          {
            key: '1-2-1',
            name: '1.2.1 Gói Thông tư 32',
            price: 20000000,
          },
          {
            key: '1-2-2',
            name: '1.2.2 Gói Cơ Bản',
            price: 20000000,
          },
          {
            key: '1-2-3',
            name: '1.2.3 Gói Tiêu Chuẩn (M)',
            price: 20000000,
          },
           {
            key: '1-2-4',
            name: '1.2.4 Gói Chuyên Sâu (M)',
            price: 20000000,
          },
           {
            key: '1-2-5',
            name: '1.2.5 Gói VIP (M)',
            price: 20000000,
          },
           {
            key: '1-2-6',
            name: '1.2.6 Gói Tiêu Chuẩn (F)',
            price: 20000000,
          },
           {
            key: '1-2-7',
            name: '1.2.7 Gói Chuyên Sâu (F)',
            price: 20000000,
          },
            {
            key: '1-2-8',
            name: '1.2.8 Gói VIP (F)',
            price: 20000000,
          },
            {
            key: '1-2-9',
            name: '1.2.9 Gói Lẻ',
            price: 20000000,
          },
          {
            key: '1-2-10',
            name: '1.2.10 Dịch Vụ Lẻ',
            price: 30000000,
            children: [
              {
                key: '1-2-10-1',
                name: '1.2.10.1 Xét Nghiệm',
                price: 40000000,
              },
               {
                key: '1-2-10-2',
                name: '1.2.10.2 Chẩn Đoán Hình Ảnh',
                price: 40000000,
              },
               {
                key: '1-2-10-3',
                name: '1.2.10.3 Thăm Dò Chức Năng',
                price: 40000000,
              },
              {
                key: '1-2-10-4',
                name: '1.2.10.4 Nội Soi',
                price: 60000000,
                children: [
                  {
                    key: '1-2-10-4-1',
                    name: '1.2.10.4.1 Dạ Dày',
                    price: 70000000,
                  },
                  {
                    key: '1-2-10-4-2',
                    name: '1.2.10.4.2 Đại Tràng',
                    price: 70000000,
                  },
                  {
                      key: '1-2-10-4-3',
                    name: '1.2.10.4.3 Trực Tràng',
                    price: 70000000,
                  },
                  {
                    key: '1-2-10-4-4',
                    name: '1.2.10.4.4 Thủ Thuật Nội Soi',
                    price: 70000000,
                  },
                  {
                    key: '1-2-10-4-5',
                    name: '1.2.10.4.5 Vật Tư Y Tế ',
                    price: 70000000,
                  },
                ],
              },
                {
               key: '1-2-10-5',
                name: '1.2.10.5 Khám Lâm Sàng',
                price: 50000000,
              },
            ],
          },
           {
            key: '1-2-11',
            name: '1.2.11 Thuốc',
            price: 30000000,
          },
        ],
      },
      {
        key: '1-3',
        name: '1.3 Bác Sĩ Chỉ Định',
        price: 10000000,
        children: [
          {
            key: '1-3-1',
            name: '1.3.1 Dịch Vụ Lẻ',
            price: 30000000,
            children: [
              {
                key: '1-3-1-1',
                name: '1.3.1.1 Xét Nghiệm',
                price: 40000000,
              },
               {
                key: '1-3-1-2',
                name: '1.3.1.2 Chẩn Đoán Hình Ảnh',
                price: 40000000,
              },
               {
                key: '1-3-1-3',
                name: '1.3.1.3 Thăm Dò Chức Năng',
                price: 40000000,
              },
              {
                key: '1-3-1-4',
                name: '1.3.1.4 Nội Soi',
                price: 60000000,
                children: [
                  {
                    key: '1-3-1-4-1',
                    name: '1.3.1.4.1 Dạ Dày',
                    price: 70000000,
                  },
                  {
                    key: '1-3-1-4-2',
                    name: '1.3.1.4.2 Đại Tràng',
                    price: 70000000,
                  },
                  {
                    key: '1-3-1-4-3',
                    name: '1.3.1.4.3 Trực Tràng',
                    price: 70000000,
                  },
                  {
                    key: '1-3-1-4-4',
                    name: '1.3.1.4.4 Thủ Thuật Nội Soi',
                    price: 70000000,
                  },
                  {
                    key: '1-3-1-4-5',
                    name: '1.3.1.4.5 Vật Tư Y Tế ',
                    price: 70000000,
                  },
                ],
              },
                {
               key: '1-3-1-5',
                name: '1.3.1.5 Khám Lâm Sàng',
                price: 50000000,
              },
            ],
          },
           {
            key: '1-3-2',
            name: '1.3.2 Thuốc',
            price: 30000000,
          },
        ],
      },
        {
        key: '1-4',
        name: '1.4 Endo Clinic',
        price: 10000000,
        children: [
          {
            key: '1-4-1',
            name: '1.4.1 Gói Nam',
            price: 30000000,
          },
           {
            key: '1-4-2',
            name: '1.4.2 Gói Nữ',
            price: 30000000,
          },
            {
            key: '1-4-3',
            name: '1.4.3 Gói Lẻ',
            price: 30000000,
          },
              {
            key: '1-4-4',
            name: '1.4.4 Dịch Vụ Lẻ',
            price: 30000000,
             children: [
              {
                key: '1-4-4-1',
                name: '1.4.4.1 Xét Nghiệm',
                price: 40000000,
              },
               {
                key: '1-4-4-2',
                name: '1.4.4.2 Chẩn Đoán Hình Ảnh',
                price: 40000000,
              },
               {
                key: '1-4-4-3',
                name: '1.4.4.3 Thăm Dò Chức Năng',
                price: 40000000,
              },
              {
                key: '1-4-4-4',
                name: '1.4.4.4 Nội Soi',
                price: 60000000,
                children: [
                  {
                    key: '1-4-4-4-1',
                    name: '1.4.4.4.1 Dạ Dày',
                    price: 70000000,
                  },
                  {
                    key: '1-4-4-4-2',
                    name: '1.4.4.4.2 Đại Tràng',
                    price: 70000000,
                  },
                  {
                    key: '1-4-4-4-3',
                    name: '1.4.4.4.3 Trực Tràng',
                    price: 70000000,
                  },
                  {
                    key: '1-4-4-4-4',
                    name: '1.4.4.4.4 Thủ Thuật Nội Soi',
                    price: 70000000,
                  },
                  {
                    key: '1-4-4-4-5',
                    name: '1.4.4.4.5 Vật Tư Y Tế ',
                    price: 70000000,
                  },
                ],
              },
                {
               key: '1-4-4-5',
                name: '1.4.4.5 Khám Lâm Sàng',
                price: 50000000,
              },
            ],
          },
                 {
            key: '1-4-5',
            name: '1.4.5 Thuốc',
            price: 30000000,
          },
        ],
      },
    ],
  },
  {
    key: '2',
    name: '2. Giảm Trừ Doanh Thu',
    price: 300000000,
    children: [
      {
        key: '2-1',
        name: '2.1 Doctor Check Cá Nhân',
        price: 10000000,
        children: [
          {
            key: '2-1-1',
            name: '2.1.1 Gói Nam',
            price: 20000000,
          },
          {
            key: '2-1-2',
            name: '2.1.2 Gói Nữ',
            price: 20000000,
          },
           {
            key: '2-1-3',
            name: '2.1.3 Gói Lẻ',
            price: 20000000,
          },
         
          {
            key: '2-1-4',
            name: '2.1.4 Dịch Vụ Lẻ',
            price: 30000000,
            children: [
              {
                key: '2-1-4-1',
                name: '2.1.4.1 Xét Nghiệm ',
                price: 40000000,
              },
              {
                key: '2-1-4-2',
                name: '2.1.4.2 Chẩn Đoán Hình Ảnh',
                price: 50000000,
              },
               {
               key: '2-1-4-3',
                name: '2.1.4.3 Thăm Dò Chức Năng',
                price: 50000000,
              },
              {
                key: '2-1-4-4',
                name: '2.1.4.4 Nội Soi',
                price: 60000000,
                children: [
                  {
                    key: '2-1-4-4-1',
                    name: '2.1.4.4.1 Dạ Dày',
                    price: 70000000,
                  },
                  {
                    key: '2-1-4-4-2',
                    name: '2.1.4.4.2 Đại Tràng',
                    price: 70000000,
                  },
                  {
                    key: '2-1-4-4-3',
                    name: '2.1.4.4.3 Trực Tràng',
                    price: 70000000,
                  },
                  {
                    key: '2-1-4-4-4',
                    name: '2.1.4.4.4 Thủ Thuật Nội Soi',
                    price: 70000000,
                  },
                  {
                    key: '2-1-4-4-5',
                    name: '2.1.4.4.5 Vật Tư Y Tế ',
                    price: 70000000,
                  },
                ],
              },
                {
               key: '2-1-4-5',
                name: '2.1.4.5 Khám Lâm Sàng',
                price: 50000000,
              },
            ],
          },
           {
            key: '2-1-5',
            name: '2.1.5 Thuốc',
            price: 30000000,
            children: [
              {
                key: '2-1-5-1',
                name: '2.1.5.1 Thuốc Bảo Hiểm',
                price: 40000000,
              },
               {
                key: '2-1-5-2',
                name: '2.1.5.2 Thuốc Dịch Vụ',
                price: 40000000,
              },
            ],
          },
        ],
      },
       {
        key: '2-2',
        name: '2.2 Doanh Nghiệp',
        price: 10000000,
        children: [
          {
            key: '2-2-1',
            name: '2.2.1 Gói Thông tư 32',
            price: 20000000,
          },
          {
            key: '2-2-2',
            name: '2.2.2 Gói Cơ Bản',
            price: 20000000,
          },
          {
            key: '2-2-3',
            name: '2.2.3 Gói Tiêu Chuẩn (M)',
            price: 20000000,
          },
           {
            key: '2-2-4',
            name: '2.2.4 Gói Chuyên Sâu (M)',
            price: 20000000,
          },
           {
            key: '2-2-5',
            name: '2.2.5 Gói VIP (M)',
            price: 20000000,
          },
           {
            key: '2-2-6',
            name: '2.2.6 Gói Tiêu Chuẩn (F)',
            price: 20000000,
          },
           {
            key: '2-2-7',
            name: '2.2.7 Gói Chuyên Sâu (F)',
            price: 20000000,
          },
            {
            key: '2-2-8',
            name: '2.2.8 Gói VIP (F)',
            price: 20000000,
          },
            {
            key: '2-2-9',
            name: '2.2.9 Gói Lẻ',
            price: 20000000,
          },
          {
            key: '2-2-10',
            name: '2.2.10 Dịch Vụ Lẻ',
            price: 30000000,
            children: [
              {
                key: '2-2-10-1',
                name: '2.2.10.1 Xét Nghiệm',
                price: 40000000,
              },
               {
                key: '2-2-10-2',
                name: '2.2.10.2 Chẩn Đoán Hình Ảnh',
                price: 40000000,
              },
               {
                key: '2-2-10-3',
                name: '2.2.10.3 Thăm Dò Chức Năng',
                price: 40000000,
              },
              {
                key: '2-2-10-4',
                name: '2.2.10.4 Nội Soi',
                price: 60000000,
                children: [
                  {
                    key: '2-2-10-4-1',
                    name: '2.2.10.4.1 Dạ Dày',
                    price: 70000000,
                  },
                  {
                    key: '2-2-10-4-2',
                    name: '2.2.10.4.2 Đại Tràng',
                    price: 70000000,
                  },
                  {
                      key: '2-2-10-4-3',
                    name: '2.2.10.4.3 Trực Tràng',
                    price: 70000000,
                  },
                  {
                    key: '2-2-10-4-4',
                    name: '2.2.10.4.4 Thủ Thuật Nội Soi',
                    price: 70000000,
                  },
                  {
                    key: '2-2-10-4-5',
                    name: '2.2.10.4.5 Vật Tư Y Tế ',
                    price: 70000000,
                  },
                ],
              },
                {
               key: '2-2-10-5',
                name: '2.2.10.5 Khám Lâm Sàng',
                price: 50000000,
              },
            ],
          },
           {
            key: '2-2-11',
            name: '2.2.11 Thuốc',
            price: 30000000,
          },
        ],
      },
      {
        key: '2-3',
        name: '2.3 Bác Sĩ Chỉ Định',
        price: 10000000,
        children: [
          {
            key: '2-3-1',
            name: '2.3.1 Dịch Vụ Lẻ',
            price: 30000000,
            children: [
              {
                key: '2-3-1-1',
                name: '2.3.1.1 Xét Nghiệm',
                price: 40000000,
              },
               {
                key: '2-3-1-2',
                name: '2.3.1.2 Chẩn Đoán Hình Ảnh',
                price: 40000000,
              },
               {
                key: '2-3-1-3',
                name: '2.3.1.3 Thăm Dò Chức Năng',
                price: 40000000,
              },
              {
                key: '2-3-1-4',
                name: '2.3.1.4 Nội Soi',
                price: 60000000,
                children: [
                  {
                    key: '2-3-1-4-1',
                    name: '2.3.1.4.1 Dạ Dày',
                    price: 70000000,
                  },
                  {
                    key: '2-3-1-4-2',
                    name: '2.3.1.4.2 Đại Tràng',
                    price: 70000000,
                  },
                  {
                    key: '2-3-1-4-3',
                    name: '2.3.1.4.3 Trực Tràng',
                    price: 70000000,
                  },
                  {
                    key: '2-3-1-4-4',
                    name: '2.3.1.4.4 Thủ Thuật Nội Soi',
                    price: 70000000,
                  },
                  {
                    key: '2-3-1-4-5',
                    name: '2.3.1.4.5 Vật Tư Y Tế ',
                    price: 70000000,
                  },
                ],
              },
                {
               key: '2-3-1-5',
                name: '2.3.1.5 Khám Lâm Sàng',
                price: 50000000,
              },
            ],
          },
           {
            key: '2-3-2',
            name: '2.3.2 Thuốc',
            price: 30000000,
          },
        ],
      },
        {
        key: '2-4',
        name: '2.4 Endo Clinic',
        price: 10000000,
        children: [
          {
            key: '2-4-1',
            name: '2.4.1 Gói Nam',
            price: 30000000,
          },
           {
            key: '2-4-2',
            name: '2.4.2 Gói Nữ',
            price: 30000000,
          },
            {
            key: '2-4-3',
            name: '2.4.3 Gói Lẻ',
            price: 30000000,
          },
              {
            key: '2-4-4',
            name: '2.4.4 Dịch Vụ Lẻ',
            price: 30000000,
             children: [
              {
                key: '2-4-4-1',
                name: '2.4.4.1 Xét Nghiệm',
                price: 40000000,
              },
               {
                key: '2-4-4-2',
                name: '2.4.4.2 Chẩn Đoán Hình Ảnh',
                price: 40000000,
              },
               {
                key: '2-4-4-3',
                name: '2.4.4.3 Thăm Dò Chức Năng',
                price: 40000000,
              },
              {
                key: '2-4-4-4',
                name: '2.4.4.4 Nội Soi',
                price: 60000000,
                children: [
                  {
                    key: '2-4-4-4-1',
                    name: '2.4.4.4.1 Dạ Dày',
                    price: 70000000,
                  },
                  {
                    key: '2-4-4-4-2',
                    name: '2.4.4.4.2 Đại Tràng',
                    price: 70000000,
                  },
                  {
                    key: '2-4-4-4-3',
                    name: '2.4.4.4.3 Trực Tràng',
                    price: 70000000,
                  },
                  {
                    key: '2-4-4-4-4',
                    name: '2.4.4.4.4 Thủ Thuật Nội Soi',
                    price: 70000000,
                  },
                  {
                    key: '2-4-4-4-5',
                    name: '2.4.4.4.5 Vật Tư Y Tế ',
                    price: 70000000,
                  },
                ],
              },
                {
               key: '2-4-4-5',
                name: '2.4.4.5 Khám Lâm Sàng',
                price: 50000000,
              },
            ],
          },
                 {
            key: '2-4-5',
            name: '2.4.5 Thuốc',
            price: 30000000,
          },
        ],
      },
    ],
  },
    {
    key: '3',
    name: '3. Doanh Thu Thực Tế (1-2)',
    price: 300000000,
    children: [
      {
        key: '3-1',
        name: '3.1 Doctor Check Cá Nhân',
        price: 10000000,
        children: [
          {
            key: '3-1-1',
            name: '3.1.1 Gói Nam',
            price: 20000000,
          },
          {
            key: '3-1-2',
            name: '3.1.2 Gói Nữ',
            price: 20000000,
          },
           {
            key: '3-1-3',
            name: '3.1.3 Gói Lẻ',
            price: 20000000,
          },
         
          {
            key: '3-1-4',
            name: '3.1.4 Dịch Vụ Lẻ',
            price: 30000000,
            children: [
              {
                key: '3-1-4-1',
                name: '3.1.4.1 Xét Nghiệm ',
                price: 40000000,
              },
              {
                key: '3-1-4-2',
                name: '3.1.4.2 Chẩn Đoán Hình Ảnh',
                price: 50000000,
              },
               {
               key: '3-1-4-3',
                name: '3.1.4.3 Thăm Dò Chức Năng',
                price: 50000000,
              },
              {
                key: '3-1-4-4',
                name: '3.1.4.4 Nội Soi',
                price: 60000000,
                children: [
                  {
                    key: '3-1-4-4-1',
                    name: '3.1.4.4.1 Dạ Dày',
                    price: 70000000,
                  },
                  {
                    key: '3-1-4-4-2',
                    name: '3.1.4.4.2 Đại Tràng',
                    price: 70000000,
                  },
                  {
                    key: '3-1-4-4-3',
                    name: '3.1.4.4.3 Trực Tràng',
                    price: 70000000,
                  },
                  {
                    key: '3-1-4-4-4',
                    name: '3.1.4.4.4 Thủ Thuật Nội Soi',
                    price: 70000000,
                  },
                  {
                    key: '3-1-4-4-5',
                    name: '3.1.4.4.5 Vật Tư Y Tế ',
                    price: 70000000,
                  },
                ],
              },
                {
               key: '3-1-4-5',
                name: '3.1.4.5 Khám Lâm Sàng',
                price: 50000000,
              },
            ],
          },
           {
            key: '3-1-5',
            name: '3.1.5 Thuốc',
            price: 30000000,
            children: [
              {
                key: '3-1-5-1',
                name: '3.1.5.1 Thuốc Bảo Hiểm',
                price: 40000000,
              },
               {
                key: '3-1-5-2',
                name: '3.1.5.2 Thuốc Dịch Vụ',
                price: 40000000,
              },
            ],
          },
        ],
      },
       {
        key: '3-2',
        name: '3.2 Doanh Nghiệp',
        price: 10000000,
        children: [
          {
            key: '3-2-1',
            name: '3.2.1 Gói Thông tư 32',
            price: 20000000,
          },
          {
            key: '3-2-2',
            name: '3.2.2 Gói Cơ Bản',
            price: 20000000,
          },
          {
            key: '3-2-3',
            name: '3.2.3 Gói Tiêu Chuẩn (M)',
            price: 20000000,
          },
           {
            key: '3-2-4',
            name: '3.2.4 Gói Chuyên Sâu (M)',
            price: 20000000,
          },
           {
            key: '3-2-5',
            name: '3.2.5 Gói VIP (M)',
            price: 20000000,
          },
           {
            key: '3-2-6',
            name: '3.2.6 Gói Tiêu Chuẩn (F)',
            price: 20000000,
          },
           {
            key: '3-2-7',
            name: '3.2.7 Gói Chuyên Sâu (F)',
            price: 20000000,
          },
            {
            key: '3-2-8',
            name: '3.2.8 Gói VIP (F)',
            price: 20000000,
          },
            {
            key: '3-2-9',
            name: '3.2.9 Gói Lẻ',
            price: 20000000,
          },
          {
            key: '3-2-10',
            name: '3.2.10 Dịch Vụ Lẻ',
            price: 30000000,
            children: [
              {
                key: '3-2-10-1',
                name: '3.2.10.1 Xét Nghiệm',
                price: 40000000,
              },
               {
                key: '3-2-10-2',
                name: '3.2.10.2 Chẩn Đoán Hình Ảnh',
                price: 40000000,
              },
               {
                key: '3-2-10-3',
                name: '3.2.10.3 Thăm Dò Chức Năng',
                price: 40000000,
              },
              {
                key: '3-2-10-4',
                name: '3.2.10.4 Nội Soi',
                price: 60000000,
                children: [
                  {
                    key: '3-2-10-4-1',
                    name: '3.2.10.4.1 Dạ Dày',
                    price: 70000000,
                  },
                  {
                    key: '3-2-10-4-2',
                    name: '3.2.10.4.2 Đại Tràng',
                    price: 70000000,
                  },
                  {
                      key: '3-2-10-4-3',
                    name: '3.2.10.4.3 Trực Tràng',
                    price: 70000000,
                  },
                  {
                    key: '3-2-10-4-4',
                    name: '3.2.10.4.4 Thủ Thuật Nội Soi',
                    price: 70000000,
                  },
                  {
                    key: '3-2-10-4-5',
                    name: '3.2.10.4.5 Vật Tư Y Tế ',
                    price: 70000000,
                  },
                ],
              },
                {
               key: '3-2-10-5',
                name: '3.2.10.5 Khám Lâm Sàng',
                price: 50000000,
              },
            ],
          },
           {
            key: '3-2-11',
            name: '3.2.11 Thuốc',
            price: 30000000,
          },
        ],
      },
      {
        key: '3-3',
        name: '3.3 Bác Sĩ Chỉ Định',
        price: 10000000,
        children: [
          {
            key: '3-3-1',
            name: '3.3.1 Dịch Vụ Lẻ',
            price: 30000000,
            children: [
              {
                key: '3-3-1-1',
                name: '3.3.1.1 Xét Nghiệm',
                price: 40000000,
              },
               {
                key: '3-3-1-2',
                name: '3.3.1.2 Chẩn Đoán Hình Ảnh',
                price: 40000000,
              },
               {
                key: '3-3-1-3',
                name: '3.3.1.3 Thăm Dò Chức Năng',
                price: 40000000,
              },
              {
                key: '3-3-1-4',
                name: '3.3.1.4 Nội Soi',
                price: 60000000,
                children: [
                  {
                    key: '3-3-1-4-1',
                    name: '3.3.1.4.1 Dạ Dày',
                    price: 70000000,
                  },
                  {
                    key: '3-3-1-4-2',
                    name: '3.3.1.4.2 Đại Tràng',
                    price: 70000000,
                  },
                  {
                    key: '3-3-1-4-3',
                    name: '3.3.1.4.3 Trực Tràng',
                    price: 70000000,
                  },
                  {
                    key: '3-3-1-4-4',
                    name: '3.3.1.4.4 Thủ Thuật Nội Soi',
                    price: 70000000,
                  },
                  {
                    key: '3-3-1-4-5',
                    name: '3.3.1.4.5 Vật Tư Y Tế ',
                    price: 70000000,
                  },
                ],
              },
                {
               key: '3-3-1-5',
                name: '3.3.1.5 Khám Lâm Sàng',
                price: 50000000,
              },
            ],
          },
           {
            key: '3-3-2',
            name: '3.3.2 Thuốc',
            price: 30000000,
          },
        ],
      },
        {
        key: '3-4',
        name: '3.4 Endo Clinic',
        price: 10000000,
        children: [
          {
            key: '3-4-1',
            name: '3.4.1 Gói Nam',
            price: 30000000,
          },
           {
            key: '3-4-2',
            name: '3.4.2 Gói Nữ',
            price: 30000000,
          },
            {
            key: '3-4-3',
            name: '3.4.3 Gói Lẻ',
            price: 30000000,
          },
              {
            key: '3-4-4',
            name: '3.4.4 Dịch Vụ Lẻ',
            price: 30000000,
             children: [
              {
                key: '3-4-4-1',
                name: '3.4.4.1 Xét Nghiệm',
                price: 40000000,
              },
               {
                key: '3-4-4-2',
                name: '3.4.4.2 Chẩn Đoán Hình Ảnh',
                price: 40000000,
              },
               {
                key: '3-4-4-3',
                name: '3.4.4.3 Thăm Dò Chức Năng',
                price: 40000000,
              },
              {
                key: '3-4-4-4',
                name: '3.4.4.4 Nội Soi',
                price: 60000000,
                children: [
                  {
                    key: '3-4-4-4-1',
                    name: '3.4.4.4.1 Dạ Dày',
                    price: 70000000,
                  },
                  {
                    key: '3-4-4-4-2',
                    name: '3.4.4.4.2 Đại Tràng',
                    price: 70000000,
                  },
                  {
                    key: '3-4-4-4-3',
                    name: '3.4.4.4.3 Trực Tràng',
                    price: 70000000,
                  },
                  {
                    key: '3-4-4-4-4',
                    name: '3.4.4.4.4 Thủ Thuật Nội Soi',
                    price: 70000000,
                  },
                  {
                    key: '3-4-4-4-5',
                    name: '3.4.4.4.5 Vật Tư Y Tế ',
                    price: 70000000,
                  },
                ],
              },
                {
               key: '3-4-4-5',
                name: '3.4.4.5 Khám Lâm Sàng',
                price: 50000000,
              },
            ],
          },
                 {
            key: '3-4-5',
            name: '3.4.5 Thuốc',
            price: 30000000,
          },
        ],
      },
    ],
  },
      {
    key: '4',
    name: '4. Giá Vốn',
    price: 300000000,
    children: [
      {
        key: '4-1',
        name: '4.1 Doctor Check Cá Nhân',
        price: 10000000,
        children: [
          {
            key: '4-1-1',
            name: '4.1.1 Gói Nam',
            price: 20000000,
          },
          {
            key: '4-1-2',
            name: '4.1.2 Gói Nữ',
            price: 20000000,
          },
           {
            key: '4-1-3',
            name: '4.1.3 Gói Lẻ',
            price: 20000000,
          },
         
          {
            key: '4-1-4',
            name: '4.1.4 Dịch Vụ Lẻ',
            price: 30000000,
            children: [
              {
                key: '4-1-4-1',
                name: '4.1.4.1 Xét Nghiệm ',
                price: 40000000,
              },
              {
                key: '4-1-4-2',
                name: '4.1.4.2 Chẩn Đoán Hình Ảnh',
                price: 50000000,
              },
               {
               key: '4-1-4-3',
                name: '4.1.4.3 Thăm Dò Chức Năng',
                price: 50000000,
              },
              {
                key: '4-1-4-4',
                name: '4.1.4.4 Nội Soi',
                price: 60000000,
                children: [
                  {
                    key: '4-1-4-4-1',
                    name: '4.1.4.4.1 Dạ Dày',
                    price: 70000000,
                  },
                  {
                    key: '4-1-4-4-2',
                    name: '4.1.4.4.2 Đại Tràng',
                    price: 70000000,
                  },
                  {
                    key: '4-1-4-4-3',
                    name: '4.1.4.4.3 Trực Tràng',
                    price: 70000000,
                  },
                  {
                    key: '4-1-4-4-4',
                    name: '4.1.4.4.4 Thủ Thuật Nội Soi',
                    price: 70000000,
                  },
                  {
                    key: '4-1-4-4-5',
                    name: '4.1.4.4.5 Vật Tư Y Tế ',
                    price: 70000000,
                  },
                ],
              },
                {
               key: '4-1-4-5',
                name: '4.1.4.5 Khám Lâm Sàng',
                price: 50000000,
              },
            ],
          },
           {
            key: '4-1-5',
            name: '4.1.5 Thuốc',
            price: 30000000,
            children: [
              {
                key: '4-1-5-1',
                name: '4.1.5.1 Thuốc Bảo Hiểm',
                price: 40000000,
              },
               {
                key: '4-1-5-2',
                name: '4.1.5.2 Thuốc Dịch Vụ',
                price: 40000000,
              },
            ],
          },
        ],
      },
       {
        key: '4-2',
        name: '4.2 Doanh Nghiệp',
        price: 10000000,
        children: [
          {
            key: '4-2-1',
            name: '4.2.1 Gói Thông tư 32',
            price: 20000000,
          },
          {
            key: '4-2-2',
            name: '4.2.2 Gói Cơ Bản',
            price: 20000000,
          },
          {
            key: '4-2-3',
            name: '4.2.3 Gói Tiêu Chuẩn (M)',
            price: 20000000,
          },
           {
            key: '4-2-4',
            name: '4.2.4 Gói Chuyên Sâu (M)',
            price: 20000000,
          },
           {
            key: '4-2-5',
            name: '4.2.5 Gói VIP (M)',
            price: 20000000,
          },
           {
            key: '4-2-6',
            name: '4.2.6 Gói Tiêu Chuẩn (F)',
            price: 20000000,
          },
           {
            key: '4-2-7',
            name: '4.2.7 Gói Chuyên Sâu (F)',
            price: 20000000,
          },
            {
            key: '4-2-8',
            name: '4.2.8 Gói VIP (F)',
            price: 20000000,
          },
            {
            key: '4-2-9',
            name: '4.2.9 Gói Lẻ',
            price: 20000000,
          },
          {
            key: '4-2-10',
            name: '4.2.10 Dịch Vụ Lẻ',
            price: 30000000,
            children: [
              {
                key: '4-2-10-1',
                name: '4.2.10.1 Xét Nghiệm',
                price: 40000000,
              },
               {
                key: '4-2-10-2',
                name: '4.2.10.2 Chẩn Đoán Hình Ảnh',
                price: 40000000,
              },
               {
                key: '4-2-10-3',
                name: '4.2.10.3 Thăm Dò Chức Năng',
                price: 40000000,
              },
              {
                key: '4-2-10-4',
                name: '4.2.10.4 Nội Soi',
                price: 60000000,
                children: [
                  {
                    key: '4-2-10-4-1',
                    name: '4.2.10.4.1 Dạ Dày',
                    price: 70000000,
                  },
                  {
                    key: '4-2-10-4-2',
                    name: '4.2.10.4.2 Đại Tràng',
                    price: 70000000,
                  },
                  {
                      key: '4-2-10-4-3',
                    name: '4.2.10.4.3 Trực Tràng',
                    price: 70000000,
                  },
                  {
                    key: '4-2-10-4-4',
                    name: '4.2.10.4.4 Thủ Thuật Nội Soi',
                    price: 70000000,
                  },
                  {
                    key: '4-2-10-4-5',
                    name: '4.2.10.4.5 Vật Tư Y Tế ',
                    price: 70000000,
                  },
                ],
              },
                {
               key: '4-2-10-5',
                name: '4.2.10.5 Khám Lâm Sàng',
                price: 50000000,
              },
            ],
          },
           {
            key: '4-2-11',
            name: '4.2.11 Thuốc',
            price: 30000000,
          },
        ],
      },
      {
        key: '4-3',
        name: '4.3 Bác Sĩ Chỉ Định',
        price: 10000000,
        children: [
          {
            key: '4-3-1',
            name: '4.3.1 Dịch Vụ Lẻ',
            price: 30000000,
            children: [
              {
                key: '4-3-1-1',
                name: '4.3.1.1 Xét Nghiệm',
                price: 40000000,
              },
               {
                key: '4-3-1-2',
                name: '4.3.1.2 Chẩn Đoán Hình Ảnh',
                price: 40000000,
              },
               {
                key: '4-3-1-3',
                name: '4.3.1.3 Thăm Dò Chức Năng',
                price: 40000000,
              },
              {
                key: '4-3-1-4',
                name: '4.3.1.4 Nội Soi',
                price: 60000000,
                children: [
                  {
                    key: '4-3-1-4-1',
                    name: '4.3.1.4.1 Dạ Dày',
                    price: 70000000,
                  },
                  {
                    key: '4-3-1-4-2',
                    name: '4.3.1.4.2 Đại Tràng',
                    price: 70000000,
                  },
                  {
                    key: '4-3-1-4-3',
                    name: '4.3.1.4.3 Trực Tràng',
                    price: 70000000,
                  },
                  {
                    key: '4-3-1-4-4',
                    name: '4.3.1.4.4 Thủ Thuật Nội Soi',
                    price: 70000000,
                  },
                  {
                    key: '4-3-1-4-5',
                    name: '4.3.1.4.5 Vật Tư Y Tế ',
                    price: 70000000,
                  },
                ],
              },
                {
               key: '4-3-1-5',
                name: '4.3.1.5 Khám Lâm Sàng',
                price: 50000000,
              },
            ],
          },
           {
            key: '4-3-2',
            name: '4.3.2 Thuốc',
            price: 30000000,
          },
        ],
      },
        {
        key: '4-4',
        name: '4.4 Endo Clinic',
        price: 10000000,
        children: [
          {
            key: '4-4-1',
            name: '4.4.1 Gói Nam',
            price: 30000000,
          },
           {
            key: '4-4-2',
            name: '4.4.2 Gói Nữ',
            price: 30000000,
          },
            {
            key: '4-4-3',
            name: '4.4.3 Gói Lẻ',
            price: 30000000,
          },
              {
            key: '4-4-4',
            name: '4.4.4 Dịch Vụ Lẻ',
            price: 30000000,
             children: [
              {
                key: '4-4-4-1',
                name: '4.4.4.1 Xét Nghiệm',
                price: 40000000,
              },
               {
                key: '4-4-4-2',
                name: '4.4.4.2 Chẩn Đoán Hình Ảnh',
                price: 40000000,
              },
               {
                key: '4-4-4-3',
                name: '4.4.4.3 Thăm Dò Chức Năng',
                price: 40000000,
              },
              {
                key: '4-4-4-4',
                name: '4.4.4.4 Nội Soi',
                price: 60000000,
                children: [
                  {
                    key: '4-4-4-4-1',
                    name: '4.4.4.4.1 Dạ Dày',
                    price: 70000000,
                  },
                  {
                    key: '4-4-4-4-2',
                    name: '4.4.4.4.2 Đại Tràng',
                    price: 70000000,
                  },
                  {
                    key: '4-4-4-4-3',
                    name: '4.4.4.4.3 Trực Tràng',
                    price: 70000000,
                  },
                  {
                    key: '4-4-4-4-4',
                    name: '4.4.4.4.4 Thủ Thuật Nội Soi',
                    price: 70000000,
                  },
                  {
                    key: '4-4-4-4-5',
                    name: '4.4.4.4.5 Vật Tư Y Tế ',
                    price: 70000000,
                  },
                ],
              },
                {
               key: '4-4-4-5',
                name: '4.4.4.5 Khám Lâm Sàng',
                price: 50000000,
              },
            ],
          },
                 {
            key: '4-4-5',
            name: '4.4.5 Thuốc',
            price: 30000000,
          },
        ],
      },
    ],
  },
        {
    key: '5',
    name: '5. Lợi Nhuận Gộp  (DOANH THU THỰC TẾ - GIÁ VỐN) (3-4)',
    price: 300000000,
    children: [
      {
        key: '5-1',
        name: '5.1 Doctor Check Cá Nhân',
        price: 10000000,
        children: [
          {
            key: '5-1-1',
            name: '5.1.1 Gói Nam',
            price: 20000000,
          },
          {
            key: '5-1-2',
            name: '5.1.2 Gói Nữ',
            price: 20000000,
          },
           {
            key: '5-1-3',
            name: '5.1.3 Gói Lẻ',
            price: 20000000,
          },
         
          {
            key: '5-1-4',
            name: '5.1.4 Dịch Vụ Lẻ',
            price: 30000000,
            children: [
              {
                key: '5-1-4-1',
                name: '5.1.4.1 Xét Nghiệm ',
                price: 40000000,
              },
              {
                key: '5-1-4-2',
                name: '5.1.4.2 Chẩn Đoán Hình Ảnh',
                price: 50000000,
              },
               {
               key: '5-1-4-3',
                name: '5.1.4.3 Thăm Dò Chức Năng',
                price: 50000000,
              },
              {
                key: '5-1-4-4',
                name: '5.1.4.4 Nội Soi',
                price: 60000000,
                children: [
                  {
                    key: '5-1-4-4-1',
                    name: '5.1.4.4.1 Dạ Dày',
                    price: 70000000,
                  },
                  {
                    key: '5-1-4-4-2',
                    name: '5.1.4.4.2 Đại Tràng',
                    price: 70000000,
                  },
                  {
                    key: '5-1-4-4-3',
                    name: '5.1.4.4.3 Trực Tràng',
                    price: 70000000,
                  },
                  {
                    key: '5-1-4-4-4',
                    name: '5.1.4.4.4 Thủ Thuật Nội Soi',
                    price: 70000000,
                  },
                  {
                    key: '5-1-4-4-5',
                    name: '5.1.4.4.5 Vật Tư Y Tế ',
                    price: 70000000,
                  },
                ],
              },
                {
               key: '5-1-4-5',
                name: '5.1.4.5 Khám Lâm Sàng',
                price: 50000000,
              },
            ],
          },
           {
            key: '5-1-5',
            name: '5.1.5 Thuốc',
            price: 30000000,
            children: [
              {
                key: '5-1-5-1',
                name: '5.1.5.1 Thuốc Bảo Hiểm',
                price: 40000000,
              },
               {
                key: '5-1-5-2',
                name: '5.1.5.2 Thuốc Dịch Vụ',
                price: 40000000,
              },
            ],
          },
        ],
      },
       {
        key: '5-2',
        name: '5.2 Doanh Nghiệp',
        price: 10000000,
        children: [
          {
            key: '5-2-1',
            name: '5.2.1 Gói Thông tư 32',
            price: 20000000,
          },
          {
            key: '5-2-2',
            name: '5.2.2 Gói Cơ Bản',
            price: 20000000,
          },
          {
            key: '5-2-3',
            name: '5.2.3 Gói Tiêu Chuẩn (M)',
            price: 20000000,
          },
           {
            key: '5-2-4',
            name: '5.2.4 Gói Chuyên Sâu (M)',
            price: 20000000,
          },
           {
            key: '5-2-5',
            name: '5.2.5 Gói VIP (M)',
            price: 20000000,
          },
           {
            key: '5-2-6',
            name: '5.2.6 Gói Tiêu Chuẩn (F)',
            price: 20000000,
          },
           {
            key: '5-2-7',
            name: '5.2.7 Gói Chuyên Sâu (F)',
            price: 20000000,
          },
            {
            key: '5-2-8',
            name: '5.2.8 Gói VIP (F)',
            price: 20000000,
          },
            {
            key: '5-2-9',
            name: '5.2.9 Gói Lẻ',
            price: 20000000,
          },
          {
            key: '5-2-10',
            name: '5.2.10 Dịch Vụ Lẻ',
            price: 30000000,
            children: [
              {
                key: '5-2-10-1',
                name: '5.2.10.1 Xét Nghiệm',
                price: 40000000,
              },
               {
                key: '5-2-10-2',
                name: '5.2.10.2 Chẩn Đoán Hình Ảnh',
                price: 40000000,
              },
               {
                key: '5-2-10-3',
                name: '5.2.10.3 Thăm Dò Chức Năng',
                price: 40000000,
              },
              {
                key: '5-2-10-4',
                name: '5.2.10.4 Nội Soi',
                price: 60000000,
                children: [
                  {
                    key: '5-2-10-4-1',
                    name: '5.2.10.4.1 Dạ Dày',
                    price: 70000000,
                  },
                  {
                    key: '5-2-10-4-2',
                    name: '5.2.10.4.2 Đại Tràng',
                    price: 70000000,
                  },
                  {
                      key: '5-2-10-4-3',
                    name: '5.2.10.4.3 Trực Tràng',
                    price: 70000000,
                  },
                  {
                    key: '5-2-10-4-4',
                    name: '5.2.10.4.4 Thủ Thuật Nội Soi',
                    price: 70000000,
                  },
                  {
                    key: '5-2-10-4-5',
                    name: '5.2.10.4.5 Vật Tư Y Tế ',
                    price: 70000000,
                  },
                ],
              },
                {
               key: '5-2-10-5',
                name: '5.2.10.5 Khám Lâm Sàng',
                price: 50000000,
              },
            ],
          },
           {
            key: '5-2-11',
            name: '5.2.11 Thuốc',
            price: 30000000,
          },
        ],
      },
      {
        key: '5-3',
        name: '5.3 Bác Sĩ Chỉ Định',
        price: 10000000,
        children: [
          {
            key: '5-3-1',
            name: '5.3.1 Dịch Vụ Lẻ',
            price: 30000000,
            children: [
              {
                key: '5-3-1-1',
                name: '5.3.1.1 Xét Nghiệm',
                price: 40000000,
              },
               {
                key: '5-3-1-2',
                name: '5.3.1.2 Chẩn Đoán Hình Ảnh',
                price: 40000000,
              },
               {
                key: '5-3-1-3',
                name: '5.3.1.3 Thăm Dò Chức Năng',
                price: 40000000,
              },
              {
                key: '5-3-1-4',
                name: '5.3.1.4 Nội Soi',
                price: 60000000,
                children: [
                  {
                    key: '5-3-1-4-1',
                    name: '5.3.1.4.1 Dạ Dày',
                    price: 70000000,
                  },
                  {
                    key: '5-3-1-4-2',
                    name: '5.3.1.4.2 Đại Tràng',
                    price: 70000000,
                  },
                  {
                    key: '5-3-1-4-3',
                    name: '5.3.1.4.3 Trực Tràng',
                    price: 70000000,
                  },
                  {
                    key: '5-3-1-4-4',
                    name: '5.3.1.4.4 Thủ Thuật Nội Soi',
                    price: 70000000,
                  },
                  {
                    key: '5-3-1-4-5',
                    name: '5.3.1.4.5 Vật Tư Y Tế ',
                    price: 70000000,
                  },
                ],
              },
                {
               key: '5-3-1-5',
                name: '5.3.1.5 Khám Lâm Sàng',
                price: 50000000,
              },
            ],
          },
           {
            key: '5-3-2',
            name: '5.3.2 Thuốc',
            price: 30000000,
          },
        ],
      },
        {
        key: '5-4',
        name: '5.4 Endo Clinic',
        price: 10000000,
        children: [
          {
            key: '5-4-1',
            name: '5.4.1 Gói Nam',
            price: 30000000,
          },
           {
            key: '5-4-2',
            name: '5.4.2 Gói Nữ',
            price: 30000000,
          },
            {
            key: '5-4-3',
            name: '5.4.3 Gói Lẻ',
            price: 30000000,
          },
              {
            key: '5-4-4',
            name: '5.4.4 Dịch Vụ Lẻ',
            price: 30000000,
             children: [
              {
                key: '5-4-4-1',
                name: '5.4.4.1 Xét Nghiệm',
                price: 40000000,
              },
               {
                key: '5-4-4-2',
                name: '5.4.4.2 Chẩn Đoán Hình Ảnh',
                price: 40000000,
              },
               {
                key: '5-4-4-3',
                name: '5.4.4.3 Thăm Dò Chức Năng',
                price: 40000000,
              },
              {
                key: '5-4-4-4',
                name: '5.4.4.4 Nội Soi',
                price: 60000000,
                children: [
                  {
                    key: '5-4-4-4-1',
                    name: '5.4.4.4.1 Dạ Dày',
                    price: 70000000,
                  },
                  {
                    key: '5-4-4-4-2',
                    name: '5.4.4.4.2 Đại Tràng',
                    price: 70000000,
                  },
                  {
                    key: '5-4-4-4-3',
                    name: '5.4.4.4.3 Trực Tràng',
                    price: 70000000,
                  },
                  {
                    key: '5-4-4-4-4',
                    name: '5.4.4.4.4 Thủ Thuật Nội Soi',
                    price: 70000000,
                  },
                  {
                    key: '5-4-4-4-5',
                    name: '5.4.4.4.5 Vật Tư Y Tế ',
                    price: 70000000,
                  },
                ],
              },
                {
               key: '5-4-4-5',
                name: '5.4.4.5 Khám Lâm Sàng',
                price: 50000000,
              },
            ],
          },
                 {
            key: '5-4-5',
            name: '5.4.5 Thuốc',
            price: 30000000,
          },
        ],
      },
    ],
  },
             {
    key: '6',
    name: '6. Chi Phí Bán Hàng & MKT',
    price: 300000000,
    children: [
      {
        key: '6-1',
        name: '6.1 Đầu tư Ads & MKT & PR',
        price: 10000000,
        children: [
          {
            key: '6-1-1',
            name: '6.1.1 Tiền Ads (Gồm VAT)',
            price: 20000000,
          },
          {
            key: '6-1-2',
            name: '6.1.2 KOL/KOC',
            price: 20000000,
          },
           {
            key: '6-1-3',
            name: '6.1.3 Đầu tư SEO',
            price: 20000000,
          },
        ],
      },
       {
        key: '6-2',
        name: '6.2 Chi phí hoa hồng',
        price: 10000000,
        children: [
          {
            key: '6-2-1',
            name: '6.2.1 Hoa hồng BS Khám',
            price: 20000000,
          },
          {
            key: '6-2-2',
            name: '6.2.2 Hoa Hồng BS Chỉ Định Cận Lâm Sàng Khác',
            price: 20000000,
          },
          {
            key: '6-2-3',
            name: '6.2.3 Hoa hồng BS Chỉ Định Cận Lâm Sàng Khác',
            price: 20000000,
          },
           {
            key: '6-2-4',
            name: '6.2.4 Hoa hồng Sale Doctor Check',
            price: 20000000,
          },
           {
            key: '6-2-5',
            name: '6.2.5 Hoa hồng Sale Khám Doanh Nghiệp',
            price: 20000000,
          },
           {
            key: '6-2-6',
            name: '6.2.6 Hoa hồng Đối Tác',
            price: 20000000,
          },
           {
            key: '6-2-7',
            name: '6.2.7 Hoa hồng Giới thiệu',
            price: 20000000,
          },
        ],
      },
      {
        key: '6-3',
        name: '6.3 Chi phí lương cứng đội Sale',
        price: 10000000,
        children: [
          {
            key: '6-3-1',
            name: '6.3.1 Lương gross sale',
            price: 30000000,
           
          },
           {
            key: '6-3-2',
            name: '6.3.2 Bảo hiểm công ty đóng',
            price: 30000000,
          },
        ],
      },
        {
        key: '6-4',
        name: '6.4 Chi phí lương cứng Marketing',
        price: 10000000,
        children: [
          {
            key: '6-4-1',
            name: '6.4.1 Lương gross MKT',
            price: 30000000,
          },
           {
            key: '6-4-2',
            name: '6.4.2 Bảo hiểm công ty đóng',
            price: 30000000,
          },
            {
            key: '6-4-3',
            name: '6.4.3 Nhuận bút TTS',
            price: 30000000,
          },
          
        ],
      },
         {
        key: '6-5',
        name: '6.5 Chi phí lương tăng ca đội Sale',
        price: 10000000,
      },
    ],
  },
      {
    key: '7',
    name: '7. Chi Phí Quản Lý Doanh Nghiệp',
    price: 300000000,
    children: [
      {
        key: '7-1',
        name: '7.1 Chi Phí Cố Định',
        price: 10000000,
        children: [
          {
            key: '7-1-1',
            name: '7.1.1 Lương Gross nhân sự',
            price: 20000000,
          },
          {
            key: '7-1-2',
            name: '7.1.2 Tăng ca nhân sự',
            price: 20000000,
          },
           {
            key: '7-1-3',
            name: '7.1.3 Bảo hiểm công ty đóng',
            price: 20000000,
          },
              {
            key: '7-1-4',
            name: '7.1.4 Tiền thuê mặt bằng',
            price: 20000000,
          },
          {
            key: '7-1-5',
            name: '7.1.5 Chi phí Nhân sự hợp tác',
            price: 30000000,
            children: [
              {
                key: '7-1-5-1',
                name: '7.1.5.1 Bác sĩ Nội',
                price: 40000000,
              },
               {
                key: '7-1-5-2',
                name: '7.1.5.2 Bác sĩ Siêu âm',
                price: 40000000,
              },
                {
                key: '7-1-5-3',
                name: '7.1.5.3 Bác sĩ Tiền mê',
                price: 40000000,
              },
                 {
                key: '7-1-5-4',
                name: '7.1.5.4 Dược sĩ',
                price: 40000000,
              },
                  {
                key: '7-1-5-5',
                name: '7.1.5.5 Bác sĩ TMH',
                price: 40000000,
              },
                   {
                key: '7-1-5-6',
                name: '7.1.5.6 CTV Pháp lý',
                price: 40000000,
              },
                    {
                key: '7-1-5-7',
                name: '7.1.5.7 CTV BHYT',
                price: 40000000,
              },
                         {
                key: '7-1-5-8',
                name: '7.1.5.8 Điều dưỡng',
                price: 40000000,
              },
                              {
                key: '7-1-5-9',
                name: '7.1.5.9 KTV Xét nghiệm',
                price: 40000000,
              },
                                   {
                key: '7-1-5-10',
                name: '7.1.5.10 KTV Gây mê',
                price: 40000000,
              },
            ],
          },
           {
            key: '7-1-6',
            name: '7.1.6 Tiền điện',
            price: 30000000,
          },
            {
            key: '7-1-7',
            name: '7.1.7 Tiền nước',
            price: 30000000,
          },
             {
            key: '7-1-8',
            name: '7.1.8 Tiền điện thoại',
            price: 30000000,
          },
              {
            key: '7-1-9',
            name: '7.1.9 Chi phí phần mềm',
            price: 30000000,
          },
        ],
      },
       {
        key: '7-2',
        name: '7.2 Chi Phí Thiết Bị',
        price: 10000000,
        children: [
          {
            key: '7-2-1',
            name: '7.2.1 Máy nội soi Fuji - ETC',
            price: 20000000,
          },
          {
            key: '7-2-2',
            name: '7.2.2 Máy nội soi Olympus - Anh Khoa',
            price: 20000000,
          },
          {
            key: '7-2-3',
            name: '7.2.3 Máy Xquang - Khang Nguyễn',
            price: 20000000,
          },
           {
            key: '7-2-4',
            name: '7.2.4 Máy Siêu Âm - Đất Việt',
            price: 20000000,
          },
           {
            key: '7-2-5',
            name: '7.2.5 Dây Đại Tràng - Anh Khoa',
            price: 20000000,
          },
        ],
      },
      {
        key: '7-3',
        name: '7.3 Chi Phí Vận Hành',
        price: 10000000,
        children: [
          {
            key: '7-3-1',
            name: '7.3.1 Văn phòng phẩm',
            price: 30000000,
          },
           {
            key: '7-3-2',
            name: '7.3.2 Chi phí Đào tạo',
            price: 30000000,
          },
            {
            key: '7-3-3',
            name: '7.3.3 Chi phí Tiếp khách',
            price: 30000000,
          },
             {
            key: '7-3-4',
            name: '7.3.4 Chi phí Gửi hồ sơ',
            price: 30000000,
          },
              {
            key: '7-3-5',
            name: '7.3.5 Chi Đầu tư cơ sở vật chất',
            price: 30000000,
          },
               {
            key: '7-3-6',
            name: '7.3.6 Chi phí Bảo trì bảo dưỡng',
            price: 30000000,
          },
                {
            key: '7-3-7',
            name: '7.3.7 Chính sách Chế độ nhân sự (YEP, Teambuilding, Thưởng,..)',
            price: 30000000,
          },
                 {
            key: '7-3-8',
            name: '7.3.8 Chi phí Dịch vụ khách hàng',
            price: 30000000,
          },
                  {
            key: '7-3-9',
            name: '7.3.9 Chi phí Thuê bãi giữ xe',
            price: 30000000,
          },
                   {
            key: '7-3-10',
            name: '7.3.10 Chi phí Công tác',
            price: 30000000,
          },
                    {
            key: '7-3-11',
            name: '7.3.11 Chi phí Giặt ủi',
            price: 30000000,
          },
                     {
            key: '7-3-12',
            name: '7.3.12 Chi phí Xử lý chất thải',
            price: 30000000,
          },
                      {
            key: '7-3-13',
            name: '7.3.13 Chi phí bài đăng Booking Care',
            price: 30000000,
          },
                       {
            key: '7-3-14',
            name: '7.3.14 Chi phí Khác',
            price: 30000000,
          },
                        {
            key: '7-3-15',
            name: '7.3.15 Thuế',
            price: 30000000,
          },
        ],
      },
      
    ],
  },
  {
    key: '8',
    name: '8. Lợi Nhuận Thuần Từ Hoạt Động Kinh Doanh (5 - 6 - 7)',
    price: 300000000,
  }
  ];