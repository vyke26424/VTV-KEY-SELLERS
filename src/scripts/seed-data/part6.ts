// prisma/seed-data/part6.ts

export const productsPart6 = [
  // ================= CATEGORY: SOFTWARE (PHẦN MỀM & WINDOWS) =================
  {
    name: 'Windows 11 Pro', 
    slug: 'windows-11-pro', 
    categorySlug: 'software',
    [cite_start]description: 'Hệ điều hành mới nhất từ Microsoft với giao diện hiện đại và khả năng bảo mật tối ưu[cite: 43]. [cite_start]Key kích hoạt Windows 11 Pro bản quyền vĩnh viễn giúp bạn mở khóa đầy đủ các tính năng nâng cao như BitLocker, Windows Sandbox và khả năng quản lý từ xa chuyên nghiệp[cite: 44]. [cite_start]Hỗ trợ cập nhật các bản vá lỗi và tính năng mới nhất trực tiếp từ Microsoft một cách thoải mái[cite: 44].',
    thumbnail: 'https://keyoff.net/wp-content/uploads/2021/10/Key-Windows-11-gia-re.jpg',
    isHot: true, 
    avgRating: 4.9, 
    keywordNames: ["windows", "key", "microsoft"],
    aiMetadata: {
      keywords: ["key win 11", "bản quyền windows", "hệ điều hành"],
      features: ["Bản quyền vĩnh viễn", "Update chính hãng", "Kích hoạt online"],
      suitable_for: ["Người dùng PC", "Laptop mới", "Doanh nghiệp"]
    },
    variants: [{ name: 'Key Vĩnh Viễn', price: 150000, orginalPrice: 3500000 }]
  },
  {
    name: 'Office 365 Family', 
    slug: 'office-365', 
    categorySlug: 'software',
    [cite_start]description: 'Giải pháp làm việc văn phòng toàn diện nhất hiện nay bao gồm Word, Excel, PowerPoint và Outlook[cite: 45]. [cite_start]Gói Family cho phép bạn nâng cấp trực tiếp trên Email cá nhân của mình, cung cấp thêm 1TB lưu trữ đám mây OneDrive để sao lưu dữ liệu an toàn[cite: 45]. [cite_start]Đặc biệt, một tài khoản có thể chia sẻ và sử dụng đồng thời trên 5 thiết bị khác nhau, phù hợp cho cả gia đình hoặc nhóm làm việc[cite: 45].',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766673865/familyoffice_yefir8.png',
    isHot: true, 
    avgRating: 4.9, 
    keywordNames: ["office", "microsoft", "google-drive"],
    aiMetadata: {
      keywords: ["word", "excel", "powerpoint", "lưu trữ đám mây"],
      features: ["Full bộ Office mới nhất", "1TB OneDrive", "Chia sẻ 5 thiết bị"],
      suitable_for: ["Gia đình", "Sinh viên", "Nhân viên văn phòng"]
    },
    variants: [{ name: '1 Năm (Slot)', price: 250000, orginalPrice: 1400000 }]
  },
  {
    name: 'IDM License Key', 
    slug: 'idm-key', 
    categorySlug: 'software',
    [cite_start]description: 'Phần mềm hỗ trợ tải xuống hàng đầu thế giới với công nghệ chia nhỏ tệp tin giúp tăng tốc độ download lên đến 500%[cite: 46]. [cite_start]Key bản quyền IDM giúp bạn tự động bắt link video từ YouTube, các trang phim và quản lý danh sách tải xuống một cách khoa học[cite: 46]. [cite_start]Sản phẩm cam kết chính hãng và bảo hành trọn đời, giúp bạn loại bỏ hoàn toàn các thông báo dùng thử phiền phức[cite: 46].',
    thumbnail: 'https://3.bp.blogspot.com/-UlQVjpBhT44/Th3BOsfBGQI/AAAAAAAAAFM/Ww2qhQgqKI8/s1600/Internet_Download_Manager.jpg',
    isHot: true, 
    avgRating: 4.9, 
    keywordNames: ["idm", "key"],
    aiMetadata: {
      keywords: ["tải nhanh", "bắt link video", "download manager"],
      features: ["Tăng tốc download 500%", "Bắt link Youtube/Phim", "Key chính hãng trọn đời"],
      suitable_for: ["Người hay tải phim", "Game thủ"]
    },
    variants: [{ name: 'Key Trọn Đời', price: 430000, orginalPrice: 600000 }]
  },
  {
    name: 'Google One 2TB (Family)', 
    slug: 'google-one-2tb', 
    categorySlug: 'software',
    [cite_start]description: 'Mở rộng không gian lưu trữ cho toàn bộ hệ sinh thái Google bao gồm Drive, Gmail và Photos[cite: 47]. [cite_start]Gói 2TB cung cấp dung lượng cực lớn để bạn sao lưu ảnh chất lượng gốc, video 4K và các tệp tin nặng mà không lo bị đầy bộ nhớ[cite: 47]. [cite_start]Tài khoản được nâng cấp chính chủ, đảm bảo tính an toàn và quyền riêng tư tuyệt đối cho dữ liệu cá nhân của bạn[cite: 47].',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Google_Drive_icon_%282020%29.svg/2295px-Google_Drive_icon_%282020%29.svg.png',
    isHot: false, 
    avgRating: 4.8, 
    keywordNames: ["google-drive", "software"],
    aiMetadata: {
      keywords: ["lưu trữ đám mây", "google photos", "nâng cấp dung lượng"],
      features: ["Dung lượng 2000GB", "Chia sẻ gia đình", "Sao lưu ảnh gốc"],
      suitable_for: ["Người dùng iPhone/Android", "Nhiếp ảnh gia"]
    },
    variants: [{ name: '2TB / 1 Năm', price: 450000, orginalPrice: 2250000 }]
  },
  {
    name: 'JetBrains All Products Pack', 
    slug: 'jetbrains-all-apps', 
    categorySlug: 'software',
    [cite_start]description: 'Bộ công cụ quyền năng nhất dành cho các nhà phát triển phần mềm chuyên nghiệp[cite: 49]. [cite_start]Gói All Products bao gồm hơn 15 công cụ lập trình hàng đầu như IntelliJ IDEA cho Java, PyCharm cho Python, WebStorm cho JavaScript và nhiều IDE khác[cite: 49]. [cite_start]Đây là sự lựa chọn tối ưu để tăng năng suất code nhờ khả năng gợi ý thông minh và kiểm tra lỗi thời gian thực[cite: 49].',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766675187/jet_cdaphk.jpg',
    isHot: false, 
    avgRating: 4.9, 
    keywordNames: ["jetbrains", "software"],
    aiMetadata: {
      keywords: ["công cụ lập trình", "intellij", "pycharm", "webstorm"],
      features: ["Full bộ 15+ IDE", "Gợi ý code thông minh", "Update phiên bản mới nhất"],
      suitable_for: ["Lập trình viên chuyên nghiệp", "Công ty công nghệ"]
    },
    variants: [{ name: '1 Năm (Cá nhân)', price: 950000, orginalPrice: 6000000 }]
  },
  {
    name: 'VMware Workstation Pro 17', 
    slug: 'vmware-workstation-pro', 
    categorySlug: 'software',
    [cite_start]description: 'Phần mềm tạo máy ảo mạnh mẽ nhất dành cho các kỹ sư hệ thống và lập trình viên[cite: 50]. [cite_start]VMware Workstation Pro cho phép bạn chạy đồng thời nhiều hệ điều hành như Windows, Linux và các hệ thống máy chủ trên cùng một chiếc máy tính vật lý duy nhất[cite: 50]. [cite_start]Đây là công cụ lý tưởng để thử nghiệm phần mềm trong các môi trường khác nhau hoặc xây dựng mô hình mạng giả lập một cách an toàn[cite: 50].',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766676228/vmware_j5dcjo.png',
    isHot: false, 
    avgRating: 4.8, 
    keywordNames: ["vmware", "software"],
    aiMetadata: {
      keywords: ["máy ảo vps", "chạy linux trên windows", "test phần mềm"],
      features: ["Chạy nhiều hệ điều hành cùng lúc", "Hỗ trợ ảo hóa mạnh mẽ", "Kết nối mạng máy ảo"],
      suitable_for: ["IT Admin", "DevOps", "Người nghiên cứu bảo mật"]
    },
    variants: [{ name: 'Key Vĩnh Viễn', price: 250000, orginalPrice: 4000000 }]
  },
  {
    name: 'WinRAR License', 
    slug: 'winrar-license-key', 
    categorySlug: 'software',
    [cite_start]description: 'Phần mềm nén và giải nén tệp tin phổ biến nhất thế giới với khả năng hỗ trợ hầu hết các định dạng nén như RAR, ZIP, CAB, 7Z[cite: 48]. [cite_start]Việc sở hữu key bản quyền giúp bạn loại bỏ hoàn toàn các thông báo yêu cầu mua hàng khó chịu mỗi khi mở ứng dụng[cite: 48]. [cite_start]Ngoài ra, WinRAR bản quyền còn cung cấp tính năng mã hóa tệp tin mạnh mẽ để bảo vệ dữ liệu của bạn khi chia sẻ qua internet[cite: 48].',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/7/70/WinRAR_5.0_icon.png',
    isHot: false, 
    avgRating: 4.7, 
    keywordNames: ["winrar", "software"],
    aiMetadata: {
      keywords: ["nén file", "giải nén rar", "winrar bản quyền"],
      features: ["Xóa thông báo dùng thử", "Nén file cực nhanh", "Mã hóa tệp tin"],
      suitable_for: ["Mọi người dùng máy tính"]
    },
    variants: [{ name: 'Key Vĩnh Viễn', price: 100000, orginalPrice: 500000 }]
  },
  {
    name: 'CleanMyMac X (Bản Quyền)', 
    slug: 'clean-my-mac-x-key', 
    categorySlug: 'software',
    description: 'Công cụ dọn dẹp và tối ưu hóa hệ thống hàng đầu dành riêng cho người dùng macOS. CleanMyMac X giúp bạn loại bỏ hàng chục gigabyte rác hệ thống, tệp tin tạm và các ứng dụng không cần thiết chỉ với một lần nhấn chuột. Ngoài ra, nó còn tích hợp bộ quét mã độc, quản lý tệp tin lớn và tính năng bảo trì giúp chiếc máy Mac của bạn luôn hoạt động nhanh như lúc mới mua.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766676671/cleanmymac_yrneeh.jpg',
    isHot: false, 
    avgRating: 4.8, 
    keywordNames: ["windows", "key"],
    aiMetadata: {
      keywords: ["tối ưu macos", "dọn rác máy tính", "tăng tốc macbook"],
      features: ["Dọn rác hệ thống thông minh", "Gỡ ứng dụng triệt để", "Quét Malware thời gian thực"],
      suitable_for: ["Người dùng Macbook/iMac", "Thiết kế đồ họa"]
    },
    variants: [{ name: 'Gói 1 Năm / 1 Mac', price: 450000, orginalPrice: 1200000 }]
  }
];