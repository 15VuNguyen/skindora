export interface MockProductRecommendation {
  productName: string;
  brand: string;
  description: string;
  imageUrl: string;
  productUrl: string;
}

export interface MockRoutine {
  title: string;
  am: string[];
  pm: string[];
}

export type Message = {
  id: string;
  isUser: boolean;
  text?: string;
  product?: MockProductRecommendation;
  routine?: MockRoutine;
  hasSubmittedFeedback?: boolean;
  isFeedbackSubmitting?: boolean;
  rating?: number;
  feedbackComment?: string;
};

const conversationScript = {
  responseToProblem: {
    id: "exp1",
    isUser: false,
    text: "Chào Linh, Minh Anh đây. Cảm ơn bạn đã tin tưởng dịch vụ tư vấn Premium của Skindora. Rất sẵn lòng hỗ trợ bạn! Để hiểu rõ hơn, bạn có thể chia sẻ về các sản phẩm bạn đang dùng trong chu trình buổi sáng và tối không?",
  },
  responseToRoutine: [
    {
      id: "exp2",
      isUser: false,
      text: "Cảm ơn Linh đã chia sẻ. Chu trình của bạn khá tốt rồi! Mụn ở vùng cằm thường có thể liên quan đến nội tiết hoặc việc làm sạch chưa đủ sâu. Minh Anh nghĩ chúng ta có thể tối ưu một chút để giải quyết vấn đề này nhé.",
    },
    {
      id: "exp3",
      isUser: false,
      product: {
        productName: "Tinh chất Phục Hồi B5 Calm & Clear",
        brand: "Skindora Labs",
        description: "Giúp làm dịu các nốt mụn sưng viêm và củng cố hàng rào bảo vệ da.",
        imageUrl:
          "https://media.hcdn.vn/catalog/product/f/a/facebook-dynamic-serum-acnes-b5-tang-cuong-duong-am-lam-diu-da-25ml-1739264607.jpg",
        productUrl: "/product/6841aa7043b1e2464b731a0a",
      },
    },
    {
      id: "exp4",
      isUser: false,
      text: "Sản phẩm này sẽ giúp da khỏe hơn, giảm tình trạng kích ứng khi dùng BHA và hỗ trợ làm mờ thâm nhanh hơn. Bạn có thể dùng nó cả sáng và tối sau bước toner nhé.",
    },
    {
      id: "exp5",
      isUser: false,
      routine: {
        title: "Kế Hoạch Chăm Sóc Da Mới Cho Linh",
        am: ["Sữa rửa mặt", "Toner", "**Tinh chất B5 Calm & Clear** (Mới)", "Serum Vitamin C", "Kem chống nắng"],
        pm: [
          "Tẩy trang & Sữa rửa mặt",
          "Toner",
          "**Tinh chất B5 Calm & Clear** (Mới)",
          "Kem dưỡng ẩm (Vào những ngày không dùng BHA)",
          "BHA (2-3 lần/tuần, dùng sau B5 15 phút)",
        ],
      },
    },
  ],
  responseToAcknowledgement: {
    id: "exp6",
    isUser: false,
    text: "Bạn hãy thử áp dụng chu trình này trong khoảng 1-2 tuần nhé. Nếu có bất kỳ phản ứng nào hoặc cần điều chỉnh, đừng ngần ngại nhắn lại cho Minh Anh bất cứ lúc nào. Mình sẽ theo dõi cùng bạn!",
  },
};

export const getExpertResponse = (userMessageCount: number): Promise<Message[]> => {
  return new Promise((resolve) => {
    let responses: Message[] = [];

    switch (userMessageCount) {
      case 1:
        responses = [conversationScript.responseToProblem];
        break;
      case 2:
        responses = conversationScript.responseToRoutine;
        break;
      case 3:
        responses = [conversationScript.responseToAcknowledgement];
        break;
      default:
        responses = [];
    }

    setTimeout(
      () => {
        resolve(responses);
      },
      1500 + Math.random() * 800
    );
  });
};
