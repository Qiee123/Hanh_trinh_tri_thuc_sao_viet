/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question } from '../types';

export const QUESTIONS_BY_GRADE_AND_REGION: Record<
  'grade_1' | 'grade_2' | 'grade_3' | 'grade_4' | 'grade_5',
  Record<string, Question[]>
> = {
  grade_1: {
    region_1: [ // Rừng Toán Học - Lớp 1 (Toán cơ bản, cộng trừ < 10, đếm số)
      {
        id: 'g1_r1_q1',
        question: 'Phép tính nào sau đây có kết quả bằng chính xác là 5?',
        answers: ['2 + 3', '1 + 2', '4 - 1', '5 + 1'],
        correct: 0,
        exp: 15,
        gold: 10,
        hint: 'Xòe bàn tay trái có 2 ngón, thêm 3 ngón tay nữa là tròn trịa bằng bao nhiêu?'
      },
      {
        id: 'g1_r1_q2',
        question: 'Mẹ mua cho Nam 8 quả táo ngọt, Nam ăn hết 3 quả. Hỏi Nam còn lại mấy quả táo?',
        answers: ['11 quả', '5 quả', '6 quả', '4 quả'],
        correct: 1,
        exp: 15,
        gold: 10,
        hint: 'Phép toán trừ bớt đi: lấy 8 bớt đi 3 nhé bé yêu!'
      },
      {
        id: 'g1_r1_q3',
        question: 'Hãy tìm giá trị của số bí ẩn x biết rằng: 10 - x = 4',
        answers: ['x = 6', 'x = 5', 'x = 7', 'x = 3'],
        correct: 0,
        exp: 15,
        gold: 10,
        hint: 'Đếm xem từ 4 cần thêm cộng mấy ngón tay để vươn tới mốc 10.'
      },
      {
        id: 'g1_r1_q4',
        question: 'Số tự nhiên liền sau của số 9 trên dãy số đếm là số nào?',
        answers: ['Số 8', 'Số 10', 'Số 11', 'Số 7'],
        correct: 1,
        exp: 15,
        gold: 10,
        hint: 'Số đi ngay sau số 9 khi em đếm một, hai, ba, ...'
      },
      {
        id: 'g1_r1_q5',
        question: 'Hình dạng học tập nào dưới đây có đúng 3 góc nhọn và 3 cạnh thẳng dẹt?',
        answers: ['Hình tròn xoe', 'Hình vuông vức', 'Hình tam giác', 'Hình chữ nhật dài'],
        correct: 2,
        exp: 15,
        gold: 10,
        hint: 'Giống như mái nhà xinh xắn che chở mưa nắng hoặc hình chiếc ê-ke kẻ vẽ.'
      }
    ],
    region_2: [ // Lâu Đài Tin Học - Lớp 1 (Bàn phím cơ bản, chuột, tư thế)
      {
        id: 'g1_r2_q1',
        question: 'Thiết bị nào sau đây của máy tính dùng để nhập chữ cái và chữ số?',
        answers: ['Chuột máy tính', 'Bàn phím máy tính', 'Cặp loa phát nhạc', 'Màn hình hiển thị'],
        correct: 1,
        exp: 15,
        gold: 10,
        hint: 'Nơi có rất nhiều phím nút bấm xinh xắn nâng bước gõ mười ngón!'
      },
      {
        id: 'g1_r2_q2',
        question: 'Chuột máy tính giúp dũng sĩ tí hon thao tác gì trên màn hình?',
        answers: ['Phát ra âm thanh tiếng kêu lẻ loi', 'Di chuyển mũi tên chỉ và chọn các biểu tượng', 'Tự động quét dọn bụi bẩn trên bàn', 'Xịt nước làm mát máy'],
        correct: 1,
        exp: 15,
        gold: 10,
        hint: 'Khi bé di chuột trên bàn di, một mũi tên nhỏ trên màn hình sẽ lướt đi theo.'
      },
      {
        id: 'g1_r2_q3',
        question: 'Để gõ khoảng trắng (cách chữ) giữa hai từ rời nhau, em dùng phím nào?',
        answers: ['Phím cách dẹt dài nhất hàng dưới', 'Phím Enter vuông vắn', 'Phím Caps Lock viết viết hoa', 'Phím ESC ở tận góc trái'],
        correct: 0,
        exp: 15,
        gold: 10,
        hint: 'Phím dẹt có chiều dài nhất trên bàn phím, nằm ở hàng dưới cùng.'
      },
      {
        id: 'g1_r2_q4',
        question: 'Để bật hoặc tắt máy tính học tập, bé bấm chọn nút quan trọng nào trên thân máy?',
        answers: ['Nút nguồn (Power)', 'Phím cách Space', 'Phím xóa Backspace', 'Nút lăn của chuột'],
        correct: 0,
        exp: 15,
        gold: 10,
        hint: 'Nút to tròn xinh có ký hiệu vòng tròn khuyết lồng gạch dọc.'
      },
      {
        id: 'g1_r2_q5',
        question: 'Để bảo vệ mắt, bé nên ngồi cách màn hình máy tính khoảng cách bao nhiêu?',
        answers: ['Dí sát mắt vào màn hình', 'Khoảng cách từ 50 cm đến 80 cm (gần một sải tay)', 'Khoảng cách 2 mét', 'Nhắm mắt hẳn lại'],
        correct: 1,
        exp: 15,
        gold: 10,
        hint: 'Khoảng bằng chiều sải một cánh tay nhỏ của bé là vừa tốt cho thủy tinh mạc.'
      }
    ],
    region_3: [ // Vùng Băng Giá Logic - Lớp 1 (Chuỗi lặp, đố vui trực quan)
      {
        id: 'g1_r3_q1',
        question: 'Xe đỏ chạy nhanh nhất, xe vàng chạy chậm hơn xe đỏ nhưng nhanh hơn xe xanh. Xe nào chạy chậm nhất?',
        answers: ['Xe đỏ rực', 'Xe vàng nắng', 'Xe xanh lá', 'Ba xe chạy ngang nhau'],
        correct: 2,
        exp: 15,
        gold: 10,
        hint: 'Xe xanh chạy chậm hơn cả xe vàng, nên xe đó đứng ở vị trí cuối.'
      },
      {
        id: 'g1_r3_q2',
        question: 'Chọn hình thích hợp điền tiếp vào chuỗi: Hình Tròn - Hình Vuông - Hình Tròn - Hình Vuông - ...?',
        answers: ['Hình Tròn', 'Hình Tam Giác', 'Hình Trái Tim', 'Hình Ngôi Sao'],
        correct: 0,
        exp: 15,
        gold: 10,
        hint: 'Quy luật lặp luân phiên xen kẽ giữa tròn và vuông liên tục.'
      },
      {
        id: 'g1_r3_q3',
        question: 'Nếu ngày hôm qua của bé là Chủ Nhật, thì ngày hôm nay rộn rã đầu tuần là thứ mấy?',
        answers: ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Bảy'],
        correct: 0,
        exp: 15,
        gold: 10,
        hint: 'Ngày đầu tiên đi học trong tuần, ngay sau ngày nghỉ Chủ Nhật thân thương.'
      },
      {
        id: 'g1_r3_q4',
        question: 'Nhà Lan nuôi 3 chú mèo. Nhà Tuấn nuôi thêm 2 chú mèo. Hỏi hai nhà có tất cả mấy chú mèo?',
        answers: ['Tất cả 5 chú mèo', 'Tất cả 4 chú mèo', 'Tất cả 6 chú mèo', 'Tất cả 3 chú mèo'],
        correct: 0,
        exp: 15,
        gold: 10,
        hint: 'Bé thực hiện phép tính gộp cộng: lấy 3 cộng với 2 xem bằng mấy nhé.'
      },
      {
        id: 'g1_r3_q5',
        question: 'Ai là người ân cần hướng dẫn bé rèn gõ mười ngón tay tại lớp học?',
        answers: ['Thầy cô giáo', 'Bạn học sinh cùng lớp', 'Chú bảo vệ', 'Nhân vật robot ảo'],
        correct: 0,
        exp: 15,
        gold: 10,
        hint: 'Người luôn chỉ dạy các kiến thức tin học bổ ích và chấm thưởng huy hiệu đạt điểm.'
      }
    ],
    region_4: [ // Núi Lửa Tư Duy - Lớp 1 (Nắng, mưa, mầm cây, gà gáy)
      {
        id: 'g1_r4_q1',
        question: 'Hạt mầm cây xanh của bé bé cần điều kiện tự nhiên gì nhất để lớn lên khỏe mạnh?',
        answers: ['Nước tưới mát lành và ánh nắng ban mai', 'Sữa chua dâu tây mát lạnh', 'Đồ chơi lắp ráp', 'Nước ngọt ngọt sắc'],
        correct: 0,
        exp: 15,
        gold: 10,
        hint: 'Cây cối cần nguồn nước mát dưỡng chất ẩm và ánh mặt trời chiếu sáng lục diệp.'
      },
      {
        id: 'g1_r4_q2',
        question: 'Để sưởi ấm thế giới và cung cấp ánh sáng rực rỡ, Ông Mặt Trời thức giấc chiếu rọi vào buổi nào?',
        answers: ['Ban đêm tối om', 'Ban ngày nắng ấm', 'Lúc dũng sĩ đi ngủ say', 'Lúc trăng tròn bừng sáng'],
        correct: 1,
        exp: 15,
        gold: 10,
        hint: 'Khi bình minh ló rạng đón chào bé đến trường học tập mến yêu.'
      },
      {
        id: 'g1_r4_q3',
        question: 'Khi thả xếp một chiếc thuyền giấy nhẹ lên mặt hồ nước tĩnh lặng, điều gì xảy ra?',
        answers: ['Thuyền giấy sẽ nổi lượn trên mặt nước', 'Thuyền chìm phom xuống đáy ngay tức khắc', 'Biến đổi tức thì thành sỏi đá', 'Tự bốc khói bùng cháy'],
        correct: 0,
        exp: 15,
        gold: 10,
        hint: 'Do giấy nhẹ và khô ráo, thuyền xếp xinh xắn sẽ nổi nênh trôi bơi lững lờ.'
      },
      {
        id: 'g1_r4_q4',
        question: 'Con vật nuôi thân thương nào thường nhảy lên gáy ò ó o báo hiệu bình minh sắp lên?',
        answers: ['Chú mèo mun bắt chuột', 'Chú chó đốm giữ nhà', 'Chú gà trống dũng mãnh', 'Chú vịt con kêu cạp cạp'],
        correct: 2,
        exp: 15,
        gold: 10,
        hint: 'Chú gà trống oai vệ khoác áo lông sặc sỡ đón chào ngày mới bắt đầu.'
      },
      {
        id: 'g1_r4_q5',
        question: 'Bầu trời rộng lớn ban đêm lấp lánh ngự trị những hình ảnh nhỏ xinh đẹp nào?',
        answers: ['Những ngôi sao và ông Trăng rằm', 'Những đám mây mưa vàng bốc cháy', 'Cầu vồng bảy sắc', 'Máy bay thả khói màu'],
        correct: 0,
        exp: 15,
        gold: 10,
        hint: 'Trời đêm tối thẫm có ánh trăng dịu mát che chở rạng bóng muôn vì tinh tú.'
      }
    ],
    region_5: [ // Đảo Rồng MOS - Lớp 1 (Xóa văn bản, Paint vẽ, Word biểu tượng)
      {
        id: 'g1_r5_q1',
        question: 'Để chữa lại lỗi gõ sai chữ cái vừa gõ, bé sử dụng nút phím xóa nào?',
        answers: ['Phím Backspace (phím có mũi tên chỉ sang trái)', 'Phím Shift to chừng', 'Phím cách Space bar', 'Phím Alt dẹt'],
        correct: 0,
        exp: 15,
        gold: 10,
        hint: 'Phím nằm ở góc trên phía bên phải khu vực chứa các phím chữ cái.'
      },
      {
        id: 'g1_r5_q2',
        question: 'Để biểu diễn trình bày các tấm slide hình ảnh chuyển động sinh động, ta dùng ứng dụng nào?',
        answers: ['Microsoft PowerPoint', 'Máy tính bấm số Calculator', 'Ứng dụng vẽ hình Paint', 'Trình nghe nhạc đơn giản'],
        correct: 0,
        exp: 15,
        gold: 10,
        hint: 'Biểu tượng màu cam gạch chữ P lớn rực rỡ dã ngoại tri thức.'
      },
      {
        id: 'g1_r5_q3',
        question: 'Ứng dụng Microsoft Word với giao diện trang nền trắng giống cuốn vở giúp bé rèn luyện gì?',
        answers: ['Luyện gõ chữ, soạn văn bản', 'Dùng cọ vẽ tô màu lăng kính', 'Xem video ca kịch hoạt hình', 'Chơi game giải đố xếp gạch'],
        correct: 0,
        exp: 15,
        gold: 10,
        hint: 'Công cụ soạn thảo quốc dân rèn luyện viết bài, viết báo cáo mười ngón.'
      },
      {
        id: 'g1_r5_q4',
        question: 'Tư thế ngồi rèn chữ cái trước bàn phím máy tính thế nào là đạt chuẩn an toàn sức khỏe?',
        answers: ['Nằm dài cằm tựa trên thành bàn', 'Ngồi thẳng lưng tự nhiên, mắt nhìn ngang tầm màn hình', 'Ngả ngẹo đầu tựa sang một bên vai', 'Cúi sát mốc trán cách kính màn hình cực gần'],
        correct: 1,
        exp: 15,
        gold: 10,
        hint: 'Ngồi ngay ngắn lưng thẳng giúp bảo vệ cột sống dũng sĩ phát triển khỏe mạnh.'
      },
      {
        id: 'g1_r5_q5',
        question: 'Để chốt nhanh việc tắt hoàn toàn một cửa sổ phần mềm rèn luyện đã xong, em click nút hình gì?',
        answers: ['Dấu trừ khuyết nhỏ', 'Dấu X màu đỏ rực rỡ góc trên bên phải', 'Hình ô vuông đơn', 'Nút mũi tên ngược'],
        correct: 1,
        exp: 15,
        gold: 10,
        hint: 'Nút đóng ở vị trí cao nhất góc phải có biểu tượng nhân chéo cực dễ nhớ.'
      }
    ],
    region_6: [ // Vương Quốc AI - Lớp 1 (Mô hình AI, chú mèo Scratch đỏ)
      {
        id: 'g1_r6_q1',
        question: 'Bộ sưu tầm máy tính thông thái biết tự trò chuyện, giải toán tự động gọi là gì?',
        answers: ['Trí tuệ nhân đạo nhân tạo (AI)', 'Cái tivi cũ hỏng', 'Phích nước phát sáng', 'Bút kẻ vẽ thủ công'],
        correct: 0,
        exp: 15,
        gold: 10,
        hint: 'Bộ não ảo do con người hợp tinh anh huấn luyện viết tắt tiếng Anh là AI.'
      },
      {
        id: 'g1_r6_q2',
        question: 'Mô hình robot học tập AI siêu việt hỗ trợ bé thân thương của lớp tốt nhất việc gì?',
        answers: ['Giải thích thắc mắc học tập và dịch từ ngữ', 'Tự đi bộ ra siêu thị mua bánh thay bé', 'Uống trà sữa dâu giùm bé', 'Vặn bánh răng lùi quá khứ'],
        correct: 0,
        exp: 15,
        gold: 10,
        hint: 'AI trả lời ngay lập tức các bài học, cách viết từ tiếng Anh sinh động.'
      },
      {
        id: 'g1_r6_q3',
        question: 'Khi muốn trò chuyện hỏi thông tin robot AI thông minh, bé viết chữ gửi yêu cầu vào đâu?',
        answers: ['Khung hộp nhập chữ Chat (Prompt)', 'Mặt sau của con chuột di', 'Tờ giấy kẹp vào ổ DVD', 'Gõ nói thầm với bàn di chuột'],
        correct: 0,
        exp: 15,
        gold: 10,
        hint: 'Gõ câu hỏi vào hộp hội thoại nhỏ xinh nằm ngay dưới góc màn hình chat.'
      },
      {
        id: 'g1_r6_q4',
        question: 'Phần mềm lắp ghép khối màu thông dụng Scratch biểu diễn bằng hình đại diện con vật nào sắc màu xám vàng?',
        answers: ['Chú mèo vàng ngộ nghĩnh', 'Chú rùa xanh bền bỉ', 'Chú chim cổ rụt', 'Chú rồng lửa đỏ'],
        correct: 0,
        exp: 15,
        gold: 10,
        hint: 'Chú mèo vàng Scratch thông minh vẫy chào mừng bé tập kéo thả các khối.'
      },
      {
        id: 'g1_r6_q5',
        question: 'Mặc dù có robot AI hỗ trợ đắc lực, nhưng bé yêu có cần tự làm bài tập để thông minh hơn không?',
        answers: ['Rất cần tự mình tư duy rèn luyện kỹ năng', 'Để mặc kệ robot làm bài thay hộ sạch', 'Nhờ bố mẹ gõ hết', 'Không cần học hành nữa'],
        correct: 0,
        exp: 15,
        gold: 10,
        hint: 'Tự hào làm bài giúp phát triển nơ-ron não bộ, chuẩn bị cho tương lai dũng sĩ.'
      }
    ]
  },
  grade_2: {
    region_1: [ // Rừng Toán Học - Lớp 2 (Nhân 2 và 5, chia 2 và 5, chu vi cơ bản)
      {
        id: 'g2_r1_q1',
        question: 'Dũng sĩ hãy thực hiện nhẩm nhanh phép toán cộng sau: 45 + 35 = ?',
        answers: ['60', '70', '80', '90'],
        correct: 2,
        exp: 15,
        gold: 12,
        hint: 'Hàng đơn vị 5+5=10 viết 0 nhớ 1, hàng chục 4+3=7 thêm 1 nhớ là...'
      },
      {
        id: 'g2_r1_q2',
        question: 'Phép nhân nào trong bảng cửu chương dưới đây có kết quả bằng 18?',
        answers: ['2 x 9', '2 x 8', '5 x 3', '5 x 4'],
        correct: 0,
        exp: 15,
        gold: 12,
        hint: 'Phép tính gấp 2 lần của số chín, bé đếm nhảy cóc bảng nhân 2 nhé.'
      },
      {
        id: 'g2_r1_q3',
        question: 'Mẹ có 24 chiếc bánh ngon chia đều cho 4 bạn nhỏ. Mỗi bạn có bao nhiêu chiếc?',
        answers: ['5 chiếc', '6 chiếc', '7 chiếc', '8 chiếc'],
        correct: 1,
        exp: 15,
        gold: 12,
        hint: 'Sử dụng bảng chia hoặc bảng nhân thích hợp: số nào nhân với mốc 4 bằng 24?'
      },
      {
        id: 'g2_r1_q4',
        question: 'Số tự nhiên bé đứng ngay trước (số liền trước) của số một trăm tròn chục là số nào?',
        answers: ['99', '101', '90', '98'],
        correct: 0,
        exp: 15,
        gold: 12,
        hint: 'Bớt đi 1 đơn vị ngay từ mốc số chẵn ba chữ số nhỏ nhất 100.'
      },
      {
        id: 'g2_r1_q5',
        question: 'Một hình tam giác có ba cạnh bằng nhau, biết mỗi cạnh dài 6 cm. Chu vi của hình đó là:',
        answers: ['12 cm', '15 cm', '18 cm', '24 cm'],
        correct: 2,
        exp: 15,
        gold: 12,
        hint: 'Chu vi tam giác bằng tổng chiều dài ba đường cạnh cộng lại: 6 + 6 + 6.'
      }
    ],
    region_2: [ // Lâu Đài Tin Học - Lớp 2 (CapsLock in hoa, Enter dốc dòng, màn Desktop)
      {
        id: 'g2_r2_q1',
        question: 'Khi dũng sỹ gõ thấy nút phím Caps Lock bắt đầu sáng đèn lên, các chữ bé gõ ra sẽ ra sao?',
        answers: ['Chuyển thành chữ viết IN HOA sừng sững', 'Chuyển thành chữ bé ti hí', 'Tự động gạch ngang gách chữ', 'Bị xóa hoàn toàn'],
        correct: 0,
        exp: 15,
        gold: 12,
        hint: 'Phím viết hoa tiêu đề dũng mãnh, bật tắt ở lề trái bàn phím.'
      },
      {
        id: 'g2_r2_q2',
        question: 'Để nhảy xuống hàng vẽ đoạn văn mới tinh, dũng sĩ gõ mười ngón nhấn phím dẹt to nào?',
        answers: ['Phím Enter', 'Phím Space bar cách', 'Phím Shift hoa', 'Phím Esc thoát'],
        correct: 0,
        exp: 15,
        gold: 12,
        hint: 'Phím nằm ở cạnh trái khu chữ cái, có biểu tượng góc ngoặt quay trái xuống.'
      },
      {
        id: 'g2_r2_q3',
        question: 'Vùng màn hình khởi động đầu tiên đón chào bé có ảnh nền mộng mơ chứa biểu tượng phần mềm gọi là?',
        answers: ['Thùng rác Recycle Bin', 'Màn hình nền ảo Desktop', 'Thân vỏ CPU gỉ sét', 'Bàn di lót di chuột'],
        correct: 1,
        exp: 15,
        gold: 12,
        hint: 'Bàn làm việc tin học ảo chứa rất nhiều lối tắt chạy nhanh ứng dụng.'
      },
      {
        id: 'g2_r2_q4',
        question: 'Để gõ nhanh một từ cái viết hoa chữ cái đầu tiên duy nhất, tay út giữ phím gì kèm gõ chữ tắp?',
        answers: ['Phím giữ Shift', 'Phím giữ Alt', 'Phím giữ Ctrl', 'Phím giữ Backspace'],
        correct: 0,
        exp: 15,
        gold: 12,
        hint: 'Giữ phím này rồi gõ sẽ ra chữ cái in đậm rực rỡ, phím nằm hai bên lề đối xứng.'
      },
      {
        id: 'g2_r2_q5',
        question: 'Để rèn gõ mười ngón, ngón cái hai bên tay của bé được giao trọng trách canh giữ phím nào?',
        answers: ['Phím cách dài nhất (Space bar)', 'Phím Enter to', 'Phím Caps Lock hoa', 'Phím số 1 chốt'],
        correct: 0,
        exp: 15,
        gold: 12,
        hint: 'Phím gõ tạo khoảng trắng dẹt dài nằm sát ngón cái bám sát dứt khoát.'
      }
    ],
    region_3: [ // Vùng Băng Giá Logic - Lớp 2 (Phối hợp kẹo bánh, so sánh tuổi thỏ)
      {
        id: 'g2_r3_q1',
        question: 'Thỏ bông Mimi nặng 3kg, thỏ nâu Bibi nặng gấp đôi thỏ bông. Hỏi cả hai chú nặng mấy kg?',
        answers: ['6 kg nặng', '8 kg nặng', '9 kg nặng', '5 kg nặng'],
        correct: 2,
        exp: 15,
        gold: 12,
        hint: 'Thỏ nâu Bibi nặng: 3 x 2 = 6 kg. Cả hai chú nặng bằng: 3 kg cộng 6 kg.'
      },
      {
        id: 'g2_r3_q2',
        question: 'Bé có 20 cái nhãn vở, chia cho bạn An 5 cái, chia cho bạn Bình 5 cái. Hỏi bé còn mấy cái?',
        answers: ['Còn lại 10 nhãn', 'Còn lại 15 nhãn', 'Còn lại 8 nhãn', 'Còn lại 12 nhãn'],
        correct: 0,
        exp: 15,
        gold: 12,
        hint: 'Tính tổng nhãn cho đi trước (5+5=10), lấy 20 trừ bớt số nhãn này.'
      },
      {
        id: 'g2_r3_q3',
        question: 'Cá nhà bé ăn có cơm tối gồm: Ông nội, Bố, Mẹ, Chị lớn và Bé. Hỏi bé cần xếp mấy đôi đũa?',
        answers: ['3 đôi đũa', '4 đôi đũa', '5 đôi đũa', '6 đôi đũa'],
        correct: 2,
        exp: 15,
        gold: 12,
        hint: 'Mỗi dũng sĩ thành viên trong gia đình cần tương thích đúng một đôi đũa ăn.'
      },
      {
        id: 'g2_r3_q4',
        question: 'Nếu dãy có logic luân phiên: 2, 4, 6, 8, ... thì con số tiếp theo bé điền vào là số nào?',
        answers: ['9', '10', '11', '12'],
        correct: 1,
        exp: 15,
        gold: 12,
        hint: 'Dãy số chẵn tăng dần liền kề, bé cộng thêm 2 đơn vị sau số 8 nhé!'
      },
      {
        id: 'g2_r3_q5',
        question: 'Nếu kim ngắn chỉ mốc số 10 và kim dài chạy đứng đúng ở số 12, lúc này đồng hồ reo mấy giờ?',
        answers: ['10 giờ đúng', '12 giờ đúng', '2 giờ đúng', '11 giờ đúng'],
        correct: 0,
        exp: 15,
        gold: 12,
        hint: 'Kim ngắn luôn chỉ trực tiếp chỉ giờ, còn kim dài chỉ dặm mốc phút đúng.'
      }
    ],
    region_4: [ // Núi Lửa Tư Duy - Lớp 2 (Hút oxy cá mang, hành tinh đá rắn lá rễ)
      {
        id: 'g2_r4_q1',
        question: 'Loài cá bơi ngoắt ngoéo lấy không khí dưỡng khí hòa tan trong nước nhờ bộ phận nào?',
        answers: ['Hít bằng lỗ mũi', 'Hút bằng đuôi cá', 'Thở bằng mang cá', 'Hấp thụ qua vảy cứng'],
        correct: 2,
        exp: 15,
        gold: 12,
        hint: 'Hai tấm màng ở hai bên má đầu cá lật mở nhịp nhàng súc dòng nước sạch.'
      },
      {
        id: 'g2_r4_q2',
        question: 'Địa cầu xanh xinh đẹp dạt dào kỳ quan môi trường nơi loài người sống tên là gì?',
        answers: ['Sao Hỏa nóng rát', 'Trái Đất thân yêu', 'Mặt Trăng hoang vu', 'Sao Kim chói lòa'],
        correct: 1,
        exp: 15,
        gold: 12,
        hint: 'Hành tinh đứng thứ ba tính từ Mặt trời, mang màu xanh ngọc mát mắt của đại dương.'
      },
      {
        id: 'g2_r4_q3',
        question: 'Những viên đá băng tuyết mát lạnh ở tủ đông được cấu tạo từ nước ở thể gì dạng rắn?',
        answers: ['Thể Khí vô hình', 'Thể Lỏng sùng sục', 'Thể Rắn cứng phẳng', 'Thể sương dạt dào'],
        correct: 2,
        exp: 15,
        gold: 12,
        hint: 'Khi bị đông lạnh ở nhiệt độ thấp dưới 0 độ, nước hóa thể rắn cứng và lạnh.'
      },
      {
        id: 'g2_r4_q4',
        question: 'Bộ phận chính nào nằm dưới đất của cây giúp hút chất màu sáp bổ sung cho cây thẳng lớn?',
        answers: ['Cành cây um tùm', 'Lá cây quang hợp', 'Rễ cây cắm sâu', 'Quả ngọt sai trĩu'],
        correct: 2,
        exp: 15,
        gold: 12,
        hint: 'Khu bám rễ vươn sâu dẻo dai bám chặt hút can-xi dinh dưỡng của đất lành.'
      },
      {
        id: 'g2_r4_q5',
        question: 'Sáng sớm tinh mọc trên kẽ lá cây rành rành xuất hiện những giọt nước lấp lánh gọi là?',
        answers: ['Giọt sương sớm', 'Hạt mưa đá lạnh', 'Dòng nhựa dẻo', 'Nước rửa thạch cao'],
        correct: 0,
        exp: 15,
        gold: 12,
        hint: 'Nước đêm đọng lại dịu mát bốc nhẹ sáng sớm khi mặt trời nắng ấm lên.'
      }
    ],
    region_5: [ // Đảo Rồng MOS - Lớp 2 (Bold, Cell, Nghiêng, PowerPoint, gạch chân)
      {
        id: 'g2_r5_q1',
        question: 'Để bôi đen chữ IN ĐẬM sang trang cuốn hút rõ mắt trong Word, bé nhấn nút chữ nào?',
        answers: ['Nút chữ B lớn (Bold)', 'Nút chữ I lệch', 'Nút chữ U dòng kẻ', 'Nút quả trứng nhỏ'],
        correct: 0,
        exp: 15,
        gold: 12,
        hint: 'Phím có chữ cái đầu tiên của từ dũng mãnh Bold, nằm ngay dưới khu lề kiểu.'
      },
      {
        id: 'g2_r5_q2',
        question: 'Ô nhỏ hình nhật chữ liên kết lồng ghép giữa hàng dọc và dòng ngang của Excel gọi là gì?',
        answers: ['Cột tính dọc', 'Hàng tính nằm', 'Ô tính rảnh (Cell)', 'Trang soạn Word'],
        correct: 2,
        exp: 15,
        gold: 12,
        hint: 'Nơi nhập từng thông tin tính toán độc lập của bảng tính Excel lớp 2.'
      },
      {
        id: 'g2_r5_q3',
        question: 'Để điều chỉnh chữ cái chữ soạn thảo nằm NGHIÊNG nghiêng nghệ thuật, em click vào?',
        answers: ['Chữ B đậm', 'Chữ I dốc nghiêng (Italic)', 'Chữ U kẻ gạch đáy', 'Dạng tô bóng đen'],
        correct: 1,
        exp: 15,
        gold: 12,
        hint: 'Bắt đầu từ chữ I nghiêng viết tắt của cụm từ Italic.'
      },
      {
        id: 'g2_r5_q4',
        question: 'Ứng dụng thuyết trình chuyên chiếu màn hình tivi gồm nhiều bức Slide ghép nối tên là gì?',
        answers: ['Microsoft PowerPoint', 'Microsoft Excel', 'Ghi chú Notepad', 'Kỳ quan Paint vẽ'],
        correct: 0,
        exp: 15,
        gold: 12,
        hint: 'Chuyên hỗ trợ thầy cô giảng chiếu bài tập trực quan lý thú.'
      },
      {
        id: 'g2_r5_q5',
        question: 'Khi muốn làm nổi bật một câu dặn dò kèm nét gạch bên dưới đáy chữ, em sử dụng phím tắt nào?',
        answers: ['Tổ hợp Ctrl + U (Underline)', 'Tổ hợp Ctrl + B đậm', 'Tổ hợp Ctrl + I nghiêng', 'Tổ hợp Ctrl + S lưu'],
        correct: 0,
        exp: 15,
        gold: 12,
        hint: 'Nút gạch chân chữ bắt đầu bằng chữ U chữ đầu của Underline dũng sỹ nhé.'
      }
    ],
    region_6: [ // Vương Quốc AI - Lớp 2 (Hàm print, Scratch khu lập trình, dữ liệu, chú mèo)
      {
        id: 'g2_r6_q1',
        question: 'Cụm viết tắt trí tuệ nhân tạo AI trong tiếng Anh mọc đầu từ hai tự nào?',
        answers: ['Artificial Intelligence', 'Apple Intern', 'Auto Instrument', 'Adult Indicator'],
        correct: 0,
        exp: 15,
        gold: 12,
        hint: 'Ý nghĩa chỉ sự tinh anh nhân tạo tạo lập bằng khoa học máy tính thông minh.'
      },
      {
        id: 'g2_r6_q2',
        question: 'Cú pháp dũng sỹ dùng để gọi máy in hiển thị chuỗi chữ ra bảng màn hình Python là gì?',
        answers: ['print()', 'show()', 'say_out()', 'echo_line()'],
        correct: 0,
        exp: 15,
        gold: 12,
        hint: 'Hành động in ấn chữ nghệ thuật ra màn hình, bé yêu đã ôn tập lặp đi lặp lại.'
      },
      {
        id: 'g2_r6_q3',
        question: 'Bảng trống kẹp giữa của Scratch giúp dũng sĩ tí hon xếp chồng block code lên nhau gọi là?',
        answers: ['Khu vực kịch bản (Script Area)', 'Kho nhạc nền dạt dào', 'Phòng chỉnh sửa mắt nhân vật', 'Góc chọn màu vẽ'],
        correct: 0,
        exp: 15,
        gold: 12,
        hint: 'Sân chơi kéo phím nơi bé tha hồ thiết kế kịch bản hoạt ảnh cho chú mèo.'
      },
      {
        id: 'g2_r6_q4',
        question: 'Để hiểu ngôn ngữ giống con người, mô hình AI phải được rèn luyện học tập từ dải dữ liệu gì?',
        answers: ['Kho tài liệu dữ liệu học tập (Training Data)', 'Chất bùn đất sông ngòi', 'Các khối nhựa đồ chơi', 'Kho ảnh phim giải trí nhảm'],
        correct: 0,
        exp: 15,
        gold: 12,
        hint: 'Dữ liệu chuẩn quy mô giúp AI chắt lọc tri thức và trả lời thông tuệ lành mạnh.'
      },
      {
        id: 'g2_r6_q5',
        question: 'Nhân vật đầu tiên dũng mãnh đứng gác sẵn tại trung tâm sân khấu khi tạo mới file Scratch là ai?',
        answers: ['Chú mèo lông vàng ngộ nghĩnh', 'Chú thỏ trắng nhấp nháy', 'Quái thú khủng long đỏ', 'Anh hùng robot sắt'],
        correct: 0,
        exp: 15,
        gold: 12,
        hint: 'Chú mèo vàng ngộ nghĩnh biểu tượng vàng huyền thoại của Scratch.'
      }
    ]
  },
  grade_3: {
    region_1: [ // Rừng Toán Học - Lớp 3 (Một nửa <1000, toán nhân chia hỗn hợp, chu vi HCN diện tích tròn)
      {
        id: 'g3_r1_q1',
        question: 'Tìm kết quả của một nửa (phép chia đôi) của số 800 tròn trăm:',
        answers: ['400', '300', '500', '200'],
        correct: 0,
        exp: 20,
        gold: 15,
        hint: 'Thực hiện phép tính lấy 800 chia đều ra 2 bên phần.'
      },
      {
        id: 'g3_r1_q2',
        question: 'Hãy tính giá trị của biểu thức phức hợp rèn luyện sau: 50 + 30 x 3 = ?',
        answers: ['240', '140', '180', '110'],
        correct: 1,
        exp: 20,
        gold: 15,
        hint: 'Luật toán học tối thượng: Thực hiện nhân phép nhân trước, rồi lấy kết quả đem cộng sau.'
      },
      {
        id: 'g3_r1_q3',
        question: 'Tính chu vi của hình chữ nhật bảnh bao có chiều dài 12 cm và chiều rộng 6 cm:',
        answers: ['18 cm', '36 cm', '72 cm', '24 cm'],
        correct: 1,
        exp: 20,
        gold: 15,
        hint: 'Chu vi = (Chiều dài + Chiều rộng) đem nhân 2.'
      },
      {
        id: 'g3_r1_q4',
        question: 'Phép toán chia sau đây có số dư là bao nhiêu đơn vị: 27 chia cho 5?',
        answers: ['Số dư bằng 1', 'Số dư bằng 2', 'Số dư bằng 3', 'Số dư bằng 4'],
        correct: 1,
        exp: 20,
        gold: 15,
        hint: 'Em nhẩm phép nhân chia: 5 x 5 = 25. Bù lại lấy 27 trừ đi 25.'
      },
      {
        id: 'g3_r1_q5',
        question: 'Lớp 3A có 32 học sinh được xếp đều tăm tắp vào 4 nhóm học nhóm. Hỏi mỗi nhóm có mấy bạn?',
        answers: ['6 bạn học', '7 bạn học', '8 bạn học', '9 bạn học'],
        correct: 2,
        exp: 20,
        gold: 15,
        hint: 'Thực hiện phép toán chia đều phân chia: lấy 32 chia cho 4.'
      }
    ],
    region_2: [ // Lâu Đài Tin Học - Lớp 3 (Ctrl+A/C/V/S, đun đúp, TaskManager)
      {
        id: 'g3_r2_q1',
        question: 'Tổ hợp cặp phím tắt gõ nhanh nào giúp bé chép nhanh vật thể đã bôi đen mà không mất văn bản?',
        answers: ['Ctrl + V (Dán)', 'Ctrl + C (Sao chép)', 'Ctrl + X (Cắt đi)', 'Ctrl + Z (Lùi lại)'],
        correct: 1,
        exp: 20,
        gold: 15,
        hint: 'Ký tự C biểu đạt viết tắt của từ sao chép tiếng anh Copy.'
      },
      {
        id: 'g3_r2_q2',
        question: 'Để cất lưu trữ bài Word đang làm dở dang nhanh tránh hỏng mất do chập điện, bé nhấn gì?',
        answers: ['Ctrl + S (Lưu bài)', 'Ctrl + A (Chọn hết)', 'Ctrl + P (In)', 'Ctrl + N (Tạo mới)'],
        correct: 0,
        exp: 20,
        gold: 15,
        hint: 'Nút S viết tắt của chữ Save mang ý nghĩa bảo lưu lưu giữ tài nguyên.'
      },
      {
        id: 'g3_r2_q3',
        question: 'Thao tác nhấp kích nhanh hai nhát phím chuột trái liên tiếp (Double Click) dùng để làm gì?',
        answers: ['Tìm cách đổi màu nền', 'Chạy mở tệp hoặc mở phần mềm tương ứng', 'Xóa bỏ thư mục lập tức', 'In bài kiểm tra ra giấy'],
        correct: 1,
        exp: 20,
        gold: 15,
        hint: 'Giúp dũng sĩ kích hoạt mở bung thư mục tệp tin dễ dàng.'
      },
      {
        id: 'g3_r2_q4',
        question: 'Khi hệ thống máy tính bị đứng đơ không bấm được gì, gộp phím Ctrl + Alt + Delete mở ra cài gì?',
        answers: ['Tấm ảnh trò chơi cổ', 'Bảng tùy chọn Task Manager kiểm soát hệ thống', 'Dòng khởi động reset mạch nguồn', 'Bông pháo hoa chúc mừng'],
        correct: 1,
        exp: 20,
        gold: 15,
        hint: 'Hộp quản trị vàng giúp tìm diệt ứng dụng đang gây đơ máy tức thì.'
      },
      {
        id: 'g3_r2_q5',
        question: 'Bé muốn bôi đen chọn nguyên cả trang văn bản dài ngoằng mà không mỏi tay lăn chuột, bé nhấn?',
        answers: ['Ctrl + A (Chọn toàn bộ)', 'Ctrl + C (Quét chép)', 'Ctrl + F (Tìm kiếm)', 'Ctrl + Z (Trở lại)'],
        correct: 0,
        exp: 20,
        gold: 15,
        hint: 'Chữ A biểu trưng cho cụm từ "Select All" - có nghĩa là quét hốt tất cả chọn lựa.'
      }
    ],
    region_3: [ // Vùng Băng Giá Logic - Lớp 3 (Gốc tuổi bố con, lá cờ xanh khởi chạy, đố số tiếp theo, đấu cờ vua)
      {
        id: 'g3_r3_q1',
        question: 'Năm nay Nam 8 tuổi tròn trịa. Tuổi của bố Nam gấp 5 lần tuổi của Nam. Hỏi bố Nam bao nhiêu tuổi?',
        answers: ['35 tuổi đời', '40 tuổi đời', '45 tuổi đời', '38 tuổi đời'],
        correct: 1,
        exp: 20,
        gold: 15,
        hint: 'Em thực hiện phép tính nhân lấy số tuổi của Nam gấp lên 5 lần.'
      },
      {
        id: 'g3_r3_q2',
        question: 'Trong thiết kế lập trình Scratch tin học, nút icon chiếc "Lá cờ màu xanh" dùng để làm gì?',
        answers: ['Bắt đầu thực thi kịch bản chạy trò chơi', 'Xóa nhân vật vĩnh viễn', 'Dừng khẩn cấp dải lệnh chạy dở', 'Bật ghi âm tiếng động'],
        correct: 0,
        exp: 20,
        gold: 15,
        hint: 'Ngọn cờ xanh phấp phới tượng trưng cho tín hiệu bắt đầu xuất trận của dũng sĩ.'
      },
      {
        id: 'g3_r3_q3',
        question: 'Minh đi ngủ lúc 10 giờ đêm và thức giấc rực rỡ lúc 6 giờ sáng hôm sau. Hỏi Minh đã ngon giấc bao nhiêu tiếng?',
        answers: ['Ngủ 6 tiếng', 'Ngủ 7 tiếng', 'Ngủ 8 tiếng', 'Ngủ 9 tiếng'],
        correct: 2,
        exp: 20,
        gold: 15,
        hint: 'Tính từ 10h đêm qua mốc 12h đêm mất 2 tiếng, cộng thêm 6 tiếng của sáng sớm trôi qua.'
      },
      {
        id: 'g3_r3_q4',
        question: 'Xét logic quy luật dãy số đếm nhảy như sau: 3, 6, 9, 12, ... Hãy điền số kế tiếp tương ứng?',
        answers: ['13', '14', '15', '16'],
        correct: 2,
        exp: 20,
        gold: 15,
        hint: 'Mỗi số đứng sau đều được cộng dặm thêm đúng 3 đơn vị.'
      },
      {
        id: 'g3_r3_q5',
        question: 'Có 3 bạn nhỏ rủ nhau đấu cờ vua giao hữu, mỗi bạn đều đấu với các bạn còn lại đúng 1 ván. Hỏi có tất cả mấy ván đấu?',
        answers: ['Có tất cả 2 ván', 'Có tất cả 3 ván', 'Có tất cả 4 ván', 'Có tất cả 6 ván'],
        correct: 1,
        exp: 20,
        gold: 15,
        hint: 'Bạn A đấu bạn B, bạn B đấu bạn C, bạn C đấu lại bạn A.'
      }
    ],
    region_4: [ // Núi Lửa Tư Duy - Lớp 3 (70% nước cơ thể, cầu vồng khúc xạ, sao Mặt Trời, khí quyển chắn cực tím)
      {
        id: 'g3_r4_q1',
        question: 'Dưỡng chất nước tinh khiết lỏng trong cơ thể chiếm khoảng bao nhiêu phần trăm tổng trọng lượng dũng sĩ?',
        answers: ['Khoảng 30% trọng lượng', 'Khoảng 50% trọng lượng', 'Khoảng 70% trọng lượng', 'Khoảng 95% trọng lượng'],
        correct: 2,
        exp: 20,
        gold: 15,
        hint: 'Chiếm đa phần kết cấu mô máu, tế bào sinh học cho cơ thể dồi dào sinh khí.'
      },
      {
        id: 'g3_r4_q2',
        question: 'Tại sao cầu vồng tuyệt đẹp nhiều màu hay tự nhiên xuất hiện sau dông mưa rào?',
        answers: ['Do tia sáng mặt trời chiếu bẻ cong lăng kính qua hàng vạn hạt nước nhỏ xíu', 'Do đám mây rực rỡ tự nhảy dựng', 'Do bụi của lá cây bay tít lên tụ màu', 'Phép thuật rực rỡ của thần gió bảo bảo'],
        correct: 0,
        exp: 20,
        gold: 15,
        hint: 'Các hạt nước li ti lơ lửng bẻ cong khúc xạ ánh sáng trắng thành giải hồng, lam, lục, vàng...'
      },
      {
        id: 'g3_r4_q3',
        question: 'Vũ trụ quanh ta sưởi ấm quả đất nhờ quả cầu nhiệt khổng lồ trung tâm tên là gì?',
        answers: ['Quả Mặt Trăng bạc', 'Mặt Trời chói lọi vĩ đại', 'Sao Hỏa đỏ rực lò', 'Sao Thổ rực rỡ vành đai'],
        correct: 1,
        exp: 20,
        gold: 15,
        hint: 'Quả tinh cầu rực đỏ ban phát ánh dương ngọc ngà đón buổi sớm mười ngón luyện tập.'
      },
      {
        id: 'g3_r4_q4',
        question: 'Lớp áo giáp không khí mỏng quây bế Trái Đất giúp chắn các tia nắng độc vũ trụ gọi là gì?',
        answers: ['Bầu khí quyển tươi mát', 'Khoảng không vũ trụ', 'Tầng lõi trái đất', 'Vùng cát sa mạc'],
        correct: 0,
        exp: 20,
        gold: 15,
        hint: 'Lớp màng điều hòa khí oxy thở che chở trái đất mộng mơ khỏi sương giá tinh tú.'
      },
      {
        id: 'g3_r4_q5',
        question: 'Loài chất vật thể nào dưới đây luôn có thể biến hình rập khuôn dập theo hình bình đựng nó?',
        answers: ['Nước lỏng mát mẻ', 'Khối đá viên vuông', 'Cây kéo kim loại', 'Quả bóng nảy màu xanh'],
        correct: 0,
        exp: 20,
        gold: 15,
        hint: 'Vật thể ở thể lỏng không có hình dạng cố định, luôn chảy len lỏi theo khay chứa.'
      }
    ],
    region_5: [ // Đảo Rồng MOS - Lớp 3 (Excel SUM cộng, PPT F5 bắt đầu chiếu, Insert Shapes tròn vuông, New Slide)
      {
        id: 'g3_r5_q1',
        question: 'Trong bảng dữ liệu phép Excel rèn luyện, hàm gõ nào cứu trợ tính cộng gộp tất cả các số một dải?',
        answers: ['Hàm tính SUM', 'Hàm tính AVERAGE trung bình', 'Hàm tính MIN nhỏ nhất', 'Hàm tính COUNT đếm dòng'],
        correct: 0,
        exp: 20,
        gold: 15,
        hint: 'Hàm gõ viết tắt từ cụm Summation danh xưng tổng số rộng rãi.'
      },
      {
        id: 'g3_r5_q2',
        question: 'Bé muốn chạy thử bài làm slide PowerPoint của mình từ trang số 1 toàn màn hình, bé gõ gì?',
        answers: ['Phím gõ F1 hướng dẫn', 'Phím gõ F5 bắt đầu chiếu', 'Phím gõ Enter xuống cái', 'Phím gõ phím cách dẹt'],
        correct: 1,
        exp: 20,
        gold: 15,
        hint: 'Phím tắt hàng đầu rực rỡ khởi kích tức thì chiến dịch trình diễn rèn mười ngón.'
      },
      {
        id: 'g3_r5_q3',
        question: 'Trong Word trình soạn thảo, để gài vẽ thêm một hình chữ nhật hay ô trái tim, dũng sỹ vào?',
        answers: ['Thẻ Insert rồi chọn mở Shapes hình học', 'Thẻ Home rèn font', 'Thẻ Layout lùi trang', 'Thẻ File chọn sao'],
        correct: 0,
        exp: 20,
        gold: 15,
        hint: 'Trong tiếng anh Insert biểu trưng lồng thêm, Shapes biểu lộ dáng vẽ.'
      },
      {
        id: 'g3_r5_q4',
        question: 'Khi rèn luyện PowerPoint, bé muốn chèn thêm một trang chiếu Slide mới dạt dào dũng mãnh, nhấn giữ?',
        answers: ['Ctrl + N mới tệp', 'Ctrl + M thêm slide mới', 'Ctrl + S lưu trữ', 'Ctrl + P ra máy in'],
        correct: 1,
        exp: 20,
        gold: 15,
        hint: 'Cụm phím tắp phổ cập trong PowerPoint giúp nhảy thêm trang trình chiếu mới mẻ.'
      },
      {
        id: 'g3_r5_q5',
        question: 'Bé muốn căn dòng soạn thảo Word hất dồn hết lề sang mép bên trái gọn gàng, tay bấm?',
        answers: ['Ctrl + L lề trái (Left)', 'Ctrl + R lề phải (Right)', 'Ctrl + E căn ở giữa', 'Ctrl + J cân đều lề'],
        correct: 0,
        exp: 20,
        gold: 15,
        hint: 'Phóng tắp bắt đầu từ phím chữ cái đầu từ Left rộn rã trái lề.'
      }
    ],
    region_6: [ // Vương Quốc AI - Lớp 3 (Prompt đầu dòng chat, Python str, Scratch Move)
      {
        id: 'g3_r6_q1',
        question: 'Dòng câu chữ bé gõ gửi yêu cầu thông thái vào cổng chat chỉ dạy cho AI gọi là gì?',
        answers: ['Prompt (Khẩu lệnh tin học)', 'Chuỗi khóa mật mã hacker', 'Link truy vết xấu', 'Lệnh xóa tệp máy'],
        correct: 0,
        exp: 20,
        gold: 15,
        hint: 'Hạt giống khởi nguồn suy luận giúp mô hình AI mài sắc lời hồi đáp cứu cánh dũng sĩ.'
      },
      {
        id: 'g3_r6_q2',
        question: 'Ngôn ngữ Python quy định kiểu định giá lưu giữ một dãy văn bản chuỗi chữ viết là?',
        answers: ['int giá số', 'str dạng String chữ', 'float số lẻ phẩy', 'bool dạng đúng sai'],
        correct: 1,
        exp: 20,
        gold: 15,
        hint: 'Viết tắt ngọt ngào của cụm từ String trong ngành lập trình thế giới chỉ chữ.'
      },
      {
        id: 'g3_r6_q3',
        question: 'Muốn kéo chú mèo vàng lập trình bước di chuyển hẳn lên trước 10 bước dải Scratch bé dùng?',
        answers: ['Khối thẻ lệnh Move 10 steps', 'Khối thẻ lệnh Turn dốc góc', 'Khối thẻ lệnh Say lóng ngóng', 'Khối thẻ lệnh Hide lẩn trốn'],
        correct: 0,
        exp: 20,
        gold: 15,
        hint: 'Hành động di dời, dịch bước tiến tới trong tiếng anh mộc mạc chính là Move.'
      },
      {
        id: 'g3_r6_q4',
        question: 'Trực giác của hệ thống AI thông thái có thể hoạt động mà không có con người dạy không?',
        answers: ['Không, AI luôn thèm dữ liệu chỉ dạy bồi đắp từ trí óc con người sáng lập', 'Có, tự nhảy kiến thức', 'AI mọc lên tự nhiên từ đất đá bóng bẩy', 'AI tự sản sinh lăng kính ảo'],
        correct: 0,
        exp: 20,
        gold: 15,
        hint: 'Con người là dũng sĩ lập trình thông minh nhất, kiến thiết nền tảng tri thức cho AI phục vụ đời sống.'
      },
      {
        id: 'g3_r6_q5',
        question: 'Dải thẻ màu vàng cam quyền lực kiểm định Đúng / Sai kịch bản của Scratch mang tên?',
        answers: ['Khối IF... THEN... điều kiện', 'Khối di chuyển MOVE', 'Khối âm thanh gáy rộn', 'Khối ẩn khẩn cấp'],
        correct: 0,
        exp: 20,
        gold: 15,
        hint: 'Thẻ kiểm định logic rẽ nhánh nếu dũng sĩ làm đáp án đúng thì cộng thưởng vàng ngọc.'
      }
    ]
  },
  grade_4: {
    region_1: [ // Rừng Toán Học - Lớp 4 (Chu vi HCN 15x10, cộng phân số 2/3+1/6, số chia hết 2 và 5, diện tích hình vuông 49cm2, trung bình cộng)
      {
        id: 'g4_r1_q1',
        question: 'D dũng sỹ ơi, hãy tính toán nhanh chu vi hình chữ nhật biết chiều dài dài 15 cm, rộng rộng 10 cm:',
        answers: ['25 cm chu vi', '50 cm chu vi', '150 cm chu vi', '100 cm chu vi'],
        correct: 1,
        exp: 25,
        gold: 18,
        hint: 'Công thức vàng: lấy chiều dài cộng chiều rộng rồi mang kết quả nhân đôi (tất cả nhân hai).'
      },
      {
        id: 'g4_r1_q2',
        question: 'Thực hiện nhẩm cộng dứt điểm hai phân số khác mẫu sau: 2/3 + 1/6 = ?',
        answers: ['3/9 phân số', '5/6 phân số', '1/2 phân số', '4/6 phân số'],
        correct: 1,
        exp: 25,
        gold: 18,
        hint: 'Quy đồng mẫu số chung là 6: đổi 2/3 bằng 4/6 rồi mải cộng một phần sáu.'
      },
      {
        id: 'g4_r1_q3',
        question: 'Tìm chữ số thích hợp để điền vào vị trí x sao cho số chẵn 85x tuyệt đối chia hết cho cho 5?',
        answers: ['Chữ số x = 2', 'Chữ số x = 5', 'Chữ số x = 0', 'Chữ số x = 4'],
        correct: 2,
        exp: 25,
        gold: 18,
        hint: 'Số muốn chia hết cho 5 thì đuôi tận cùng phải bằng 0 hoặc 5, nhưng muốn chia hết cho cả số chẵn 2 thì bắt buộc tận cùng là...'
      },
      {
        id: 'g4_r1_q4',
        question: 'Một hình vuông phẳng có diện tích đo được là 49 cm vuông. Hãy tính chu vi hình vuông báu vật đó:',
        answers: ['Cạnh dài 28 cm', 'Chu vi bằng 28 cm', 'Chu vi bằng 49 cm', 'Chu vi bằng 35 cm'],
        correct: 1,
        exp: 25,
        gold: 18,
        hint: 'Diện tích 49 nghĩa là một đường cạnh dài 7 cm (7 x 7 = 49). Lấy chiều cạnh này nhân 4 để ra chu vi.'
      },
      {
        id: 'g4_r1_q5',
        question: 'Dũng sĩ học giỏi hãy tìm số trung bình cộng của bộ ba con số bảnh bao: 10, 20 và 30 là bao nhiêu?',
        answers: ['Mốc điểm cộng là 15', 'Mốc điểm cộng là 20', 'Mốc điểm cộng là 25', 'Mốc điểm cộng là 30'],
        correct: 1,
        exp: 25,
        gold: 18,
        hint: 'Em lấy tổng cộng ba số (10 + 20 + 30) rồi lấy kết quả chia đều cho mốc 3.'
      }
    ],
    region_2: [ // Lâu Đài Tin Học - Lớp 4 (Thư mục tệp, Alt+Tab, gõ tiếng Việt dấu, đợt URL, trình duyện rầm rầm)
      {
        id: 'g4_r2_q1',
        question: 'Вên trong lớp học Windows, thư mục vàng (Folder) ngự trị thực tế giúp ích gì dũng sỹ?',
        answers: ['Sắp đặt tệp tin, sắp xếp bài làm khoa học khoa bảng', 'Tự chạy nộp bài thay bé', 'Che chắn sóng tivi hỏng', 'Điều khiến loa phát nhạc tự do'],
        correct: 0,
        exp: 25,
        gold: 18,
        hint: 'Ví như một cặp kặp tài liệu nhựa ảo xếp gọn từng trang văn bản học sỹ mười ngón.'
      },
      {
        id: 'g4_r2_q2',
        question: 'Tổ hợp phím tắt lướt nhanh lừng lẫy giúp dũng sĩ tí hon dịch chuyển lướt nhanh qua lại giữa các app đang chạy?',
        answers: ['Phím tắt Alt + Tab', 'Phím tắt Ctrl + Alt + Delete', 'Phím tắt Ctrl + V', 'Phím tắt Shift + Esc'],
        correct: 0,
        exp: 25,
        gold: 18,
        hint: 'Giúp bé tay trái giữ phím Alt gõ nhấp phím mũi tên lề trái Tab chuyển đổi cửa sổ kỳ tài.'
      },
      {
        id: 'g4_r2_q3',
        question: 'Khi gõ tiếng Việt chuẩn quy chuẩn Telex gõ phím, làm thế nào để gõ ra chữ cái Ô?',
        answers: ['Tay nhấp hai lần oo', 'Tay nhấp hai lần ow', 'Tay nhấp hai lần aa', 'Tay nhấp hai lần ee'],
        correct: 0,
        exp: 25,
        gold: 18,
        hint: 'Gõ nhân bản kép liên hồi phím o sẽ tạo ra cái nón dấu mộc ấm áp cho chữ.'
      },
      {
        id: 'g4_r2_q4',
        question: 'Liên kết dòng ký tự dài chỉ mốc địa chỉ một ngôi nhà trang mạng (v.d. https://sao-viet.com) gọi là?',
        answers: ['Dòng liên kết định vị URL / Website', 'Dải chỉ dẫn cắm RAM', 'Bản ghi của chip CPU', 'Địa chỉ ổ sạc USB'],
        correct: 0,
        exp: 25,
        gold: 18,
        hint: 'Địa chỉ tài nguyên thông tin chuẩn mực giúp tìm thẳng lối vào cổng học tin.'
      },
      {
        id: 'g4_r2_q5',
        question: 'Cổng trang rèn luyện kết nối thông tin toàn cầu giúp tra cứu nhanh tri thức kiến thức xã hội là?',
        answers: ['Cổng tìm kiếm Google mãnh mẽ', 'Kho lùi gạch tô màu Paint', 'Cửa sổ PowerPoint trơ trọi', 'Trình soạn văn bản Word cũ'],
        correct: 0,
        exp: 25,
        gold: 18,
        hint: 'Nơi dũng sĩ tí hon chỉ gõ từ khóa là hiển thị ngập tràn bài giải hữu học.'
      }
    ],
    region_3: [ // Vùng Băng Giá Logic - Lớp 3 đố mẹo con trai út, Forever, vòi nước dâng bể, hàng An 5 đứng đầu đứng cuối, nhân đôi 16
      {
        id: 'g4_r3_q1',
        question: 'Gia đình nọ có 4 bạn con trai, mỗi bạn đều có một cô em gái út duy nhất. Hỏi nhà có mấy chị em?',
        answers: ['Có tổng cộng 8 người con', 'Có tổng cộng 5 người con', 'Có tổng cộng 4 người con', 'Có tổng cộng 10 người con'],
        correct: 1,
        exp: 25,
        gold: 18,
        hint: 'Vì là cô em gái út chung mấu chốt, nên chỉ cần có đúng 1 em gái cho cả 4 anh.'
      },
      {
        id: 'g4_r3_q2',
        question: 'Tại công cụ lập trình mượt mà Scratch, khối chữ Forever (Liên tục) lặp dải code thế nào?',
        answers: ['Lặp chuyển đổi kịch bản lặp đi lặp lại mãi mãi không thôi', 'Chỉ làm mượt 1 lần duy nhất rồi ẩn mình', 'Dập tắt kịch bản khẩn cấp', 'Tự tăng rương vàng dạt dào'],
        correct: 0,
        exp: 25,
        gold: 18,
        hint: 'Vòng lặp bất tận giúp dũng sỹ tạo hành ảnh chuyển động vật thể lặp bơi vô hạn.'
      },
      {
        id: 'g4_r3_q3',
        question: 'Có một dũng sĩ mở vòi tiếp nước đầy bể mốc 3 tiếng. Hỏi dũng sỹ mở gộp 3 vòi y tạc cùng chảy thì bể dâng đầy mất mấy giờ?',
        answers: ['Mất đúng 1 tiếng đồng hồ', 'Mất đúng 3 tiếng đồng hồ', 'Mất đúng 9 tiếng đồng hồ', 'Mất đúng 6 tiếng đồng hồ'],
        correct: 0,
        exp: 25,
        gold: 18,
        hint: 'Hộ công tấp ba lực chảy ào ào gấp 3 lần, giúp bớt thời hạn đi cực nhanh.'
      },
      {
        id: 'g4_r3_q4',
        question: 'An đứng xếp hàng, đếm đầu xuống thấy mình đứng thứ 5, đếm ngược từ đáy lên thấy mình đứng thứ 5. Tập thể hàng có mấy bạn?',
        answers: ['Có tất cả 10 bạn', 'Có tất cả 9 bạn', 'Có tất cả 8 bạn', 'Có tất cả 11 bạn'],
        correct: 1,
        exp: 25,
        gold: 18,
        hint: 'An tính hai sườn hàng (5 + 5), nhớ bớt trừ đi 1 vì tên An bị đếm kép hai hồi.'
      },
      {
        id: 'g4_r3_q5',
        question: 'Dãy logic nhân gốc nhân song tiến: 1, 2, 4, 8, 16, ... Hãy tìm số mốc liền sau số 16?',
        answers: ['Số 20 chẵn chục', 'Số 24 đẹp mắt', 'Số 32 dũng mãnh', 'Số 48 rộng mở'],
        correct: 2,
        exp: 25,
        gold: 18,
        hint: 'Dùng logic nhân đôi tức là lấy con số 16 nhân đôi lên.'
      }
    ],
    region_4: [ // Núi Lửa Tư Duy - Lớp 4 (Nước lỏng sôi 100 độ C, chiếm thể tích khí nitơ 78%, âm thanh xuyên chất rắn, Heli nhe, tuần hoàn nước)
      {
        id: 'g4_r4_q1',
        question: 'Trong điều kiện áp suất thông thường ấm áp, dòng nước lỏng sẽ chuyển đổi sôi cuộn sùng sục ở nhiệt độ nào?',
        answers: ['Từ mốc 50 độ C', 'Từ mốc 80 độ C', 'Từ mốc 100 độ C chính xác', 'Từ mốc 0 độ đóng băng'],
        correct: 2,
        exp: 25,
        gold: 18,
        hint: 'Nhiệt độ sôi chuẩn mực làm nước sủi bong bóng ào ạt và bốc khói hơi mù mịt.'
      },
      {
        id: 'g4_r4_q2',
        question: 'Chất khí dạt dào chiếm mật độ lớn nhất (xấp xỉ tận 78%) che chở bầu khí quyển Trái Đất là khí nào?',
        answers: ['Khí ô-xi dưỡng thở', 'Khí Ni-tơ tự nhiên (Nitrogen)', 'Khí Các-bô-níc ngạt thở', 'Khí Heli siêu nhẹ bay'],
        correct: 1,
        exp: 25,
        gold: 18,
        hint: 'Chất khí dồi dào luôn đồng hành bảo dưỡng áp suất cân bằng cho địa cầu bé sinh hoạt.'
      },
      {
        id: 'g4_r4_q3',
        question: 'Sóng rung động âm thanh giao tiếp sẽ truyền dãn di chuyển với vận tốc thần tốc nhảy vọt nhất khi đi qua?',
        answers: ['Môi trường chất rắn (bê tông gạch bện, thanh thép đường ray)', 'Môi trường nước lỏng hồ đại dương', 'Khung không khí mây bay', 'Khoảng chân không lạnh thẳm ngoài đất'],
        correct: 0,
        exp: 25,
        gold: 18,
        hint: 'Các hạt phân tử của thể rắn xếp khít chặt vững rực, rải chuyền tín hiệu nhanh cực.'
      },
      {
        id: 'g4_r4_q4',
        question: 'Tại sao bóng bay chứa đầy khí trơ Heli tươi lại có thể bay vút nhảy lên trời xanh khi sảy tay?',
        answers: ['Bởi trọng lượng khí Heli gọn nhẹ hơn cả khối lượng không khí xung quanh', 'Bóng tự nhảy lò xo', 'Do lực vẫy của bọng cao su', 'Sắc màu bóng hút hấp lực'],
        correct: 0,
        exp: 25,
        gold: 18,
        hint: 'Hạt khí nhẹ nổi bơi ngược lên dốc cao nhún nhường khí nặng chìm tấp xuống.'
      },
      {
        id: 'g4_r4_q5',
        question: 'Dòng tuần hoàn đại dương bốc hơi tụ mây hóa lạnh sa rơi thành dòng mưa tưới mát mặt đất có tên gọi khoa học là gì?',
        answers: ['Vòng tuần hoàn nước trong tự nhiên', 'Chu trình phân hủy mây sương', 'Quá trình gạn đục lắng phèn', 'Dòng xoáy gió lốc'],
        correct: 0,
        exp: 25,
        gold: 18,
        hint: 'Hộ tống hơi mát từ sông hồ tụ lại rơi nhẹ nuôi dưỡng vạn mây lộc cây.'
      }
    ],
    region_5: [ // Đảo Rồng MOS - Lớp 4 (Paste Ctrl+V, địa chỉ $C$5 tuyệt đối, trộn gộp MergeCenter, bôi sao định dạng FormPainter, tụ WrapText)
      {
        id: 'g4_r5_q1',
        question: 'Để dán gọn ghẽ dữ liệu hay văn bản từ clipboard của máy tính ra ngoài văn trang Word, tổ hợp là:',
        answers: ['Nhấn tổ hợp Ctrl + P', 'Nhấn tổ hợp Ctrl + V (Paste)', 'Nhấn tổ hợp Ctrl + C (Sao)', 'Nhấn tổ hợp Ctrl + S (Lưu)'],
        correct: 1,
        exp: 25,
        gold: 18,
        hint: 'Tổ hợp đứng sát lề cạnh các phím sao chép cắt bỏ rèn mười ngón.'
      },
      {
        id: 'g4_r5_q2',
        question: 'Biểu hiện Excel có gắn thêm ký tự đô la đô la bảo hộ cứng cụm A và 1 dạng "$A$1" gọi là?',
        answers: ['Địa chỉ vùng tuyệt đối bảo lưu', 'Địa chỉ tương đối xoay xở', 'Địa chỉ ảo ảnh', 'Công thức lỗi dòng chéo'],
        correct: 0,
        exp: 25,
        gold: 18,
        hint: 'Khóa cứng dứt khoát không cho xê dịch khi bé bấm kéo sao ô lấy công thức.'
      },
      {
        id: 'g4_r5_q3',
        question: 'Để sáp trộn, dung kết hợp các ô nhỏ kề kề thành 1 sườn ô rông lớn gộp lề của Excel, tay bấm?',
        answers: ['Chức năng Merge & Center rộn rã', 'Chức năng bẻ dòng Wrap Text', 'Hàm tính dốc AutoSum', 'Bộ gạn phễu lọc Filter'],
        correct: 0,
        exp: 25,
        gold: 18,
        hint: 'Dịch nghĩa dung hợp lồng gộp và căn chỉnh cân đối chính vế giữa.'
      },
      {
        id: 'g4_r5_q4',
        question: 'Công cụ hình cây cọ vẽ đắc lực khép sao chép kiểu cách chữ văn bản trang Word tên là gì?',
        answers: ['Cây cọ Format Painter màu nhiệm', 'Tấm bảng dán Paste', 'Phím Bold bôi đậm đen', 'Nút Eraser tẩy màu lẹ'],
        correct: 0,
        exp: 25,
        gold: 18,
        hint: 'Quét phết sao chép cả cỡ chữ, màu sắc phông bảnh bao sang chữ khác.'
      },
      {
        id: 'g4_r5_q5',
        question: 'Khi text gõ quá dài trôi tuột khỏi lề hẹp ô Excel bừa bộn dũng sỹ dùng nút nào gập dòng dọn dẹp?',
        answers: ['Công cụ bọc góc Wrap Text', 'Nút ghép ô Merge cells', 'Bộ công cụ sắp xếp Sort', 'Hàm lấy rập khuôn SUM'],
        correct: 0,
        exp: 25,
        gold: 18,
        hint: 'Giúp dồn chữ nhảy hàng gọn gẽ tự hào nội tại lòng 1 ô tính.'
      }
    ],
    region_6: [ // Vương Quốc AI - Lớp 4 (Google Gemini, in print Python, Scratch bounce, vòng lặp hay gán biến)
      {
        id: 'g4_r6_q1',
        question: 'Hạt nhân AI siêu phẩm hội thoại của gia tộc Google có biểu tượng ánh sao bốn cánh rực rỡ tên là gì?',
        answers: ['Ứng dụng AI Gemini', 'Ứng dụng Cortana sừng sững', 'Công cụ sâu DeepMind', 'Robot gõ phím dại'],
        correct: 0,
        exp: 25,
        gold: 18,
        hint: 'Lấy tên từ danh xưng chòm sao Song Tử anh em tinh anh học thuật máy vi tính.'
      },
      {
        id: 'g4_r6_q2',
        question: 'Bé gõ lập trình Python in ra chuỗi chữ vàng "Moi cac be hoc code" đúng sườn là:',
        answers: [
          'print("Moi cac be hoc code") rực',
          'InRaMoiCacBeHocCode() rách',
          'print Moi cac be hoc code() rỗng',
          'write.text("Moi cac be hoc code") rầy'
        ],
        correct: 0,
        exp: 25,
        gold: 18,
        hint: 'Dùng cú pháp lệnh chuẩn print viết thường bọc ngoặc và nháy kép bọc chữ.'
      },
      {
        id: 'g4_r6_q3',
        question: 'Mảnh ghép logic thần thú giúp chú mèo Scratch dội nảy quay xe mượt mà khi chạm viền là?',
        answers: ['Khối lệnh If on edge, bounce xịn', 'Khối lệnh tiến bước Move 10 steps', 'Khối lệnh dải Say Hello', 'Khối lệnh Point to Mouse pointer'],
        correct: 0,
        exp: 25,
        gold: 18,
        hint: 'Cơ chế nhảy dội ngược giúp nhân vật chạy quanh trong ranh giới sân khấu vẻ.'
      },
      {
        id: 'g4_r6_q4',
        question: 'Móc lặp giữ vòng lặp mượt mà lặp lại dựa trên điều kiện lập luận trong Python dũng sĩ gõ?',
        answers: ['Vòng lặp logic while...', 'Lệnh gõ in ấn print()', 'Gắn gán trị số x = y', 'Giải nghĩa thăng ghi chú #'],
        correct: 0,
        exp: 25,
        gold: 18,
        hint: 'Vòng lặp trong khi điều kiện đúng thì mải miết lặp tiến hành code.'
      },
      {
        id: 'g4_r6_q5',
        question: 'Để khai gán chứa điểm danh giá 100 gộp lòng biến số học học x dũng sỹ Python viết?',
        answers: ['Cú pháp gán x = 100 tắp', 'Viết điểm gán x có 100', 'Để 100 vào khay x', 'Biến lưu x mốc 100'],
        correct: 0,
        exp: 25,
        gold: 18,
        hint: 'Dùng duy nhất một mốc dấu bằng (=) dũng sỹ gài gán dữ liệu mượt mà.'
      }
    ]
  },
  grade_5: {
    region_1: [ // Rừng Toán Học - Lớp 5 (Thập phân 3/5=0.6, % 20 và 80, DT tam giác 12x10, chu vi hình tròn r10, vận tốc 40km/h 2.5h)
      {
        id: 'g5_r1_q1',
        question: 'Dũng sỹ ơi, chuyển hóa nhanh phân số toán học 3/5 thành số thập phân chính xác nhé:',
        answers: ['Chuyển thành phân 0.3', 'Chuyển thành phân 0.5', 'Chuyển thành phân 0.6', 'Chuyển thành phân 1.67'],
        correct: 2,
        exp: 30,
        gold: 24,
        hint: 'Em đặt phép chia dũng sỹ: Lấy tử số 3 chia cho mẫu số 5 lành mạnh.'
      },
      {
        id: 'g5_r1_q2',
        question: 'Hãy tìm tỷ số phần trăm tương quan định danh tích toán giữa hai số ấm áp 20 và 80:',
        answers: ['Tỷ phần 25%', 'Tỷ phần 20%', 'Tỷ phần 40%', 'Tỷ phần 50%'],
        correct: 0,
        exp: 30,
        gold: 24,
        hint: 'Lấy số bé chia dồn cho số lớn được bao nhiêu rồi nhân dặm nhẩm mốc 100.'
      },
      {
        id: 'g5_r1_q3',
        question: 'Tính diện tích hình tam giác bọc báu vật có cạnh đáy 12 cm, chiều cao từ đỉnh là 10 cm:',
        answers: ['Diện tích 120 cm²', 'Diện tích 60 cm²', 'Diện tích 40 cm²', 'Diện tích 50 cm²'],
        correct: 1,
        exp: 30,
        gold: 24,
        hint: 'Công thức toán học: (Đáy nhân với Chiều cao) rồi đem kết quả chia cho 2.'
      },
      {
        id: 'g5_r1_q4',
        question: 'Hình tròn vạn năng có tâm bán kính dài r = 10 cm. Tính chu vi hình tròn xinh đẹp (Pi = 3.14):',
        answers: ['Chu vi 31.4 cm', 'Chu vi 62.8 cm', 'Chu vi 78.5 cm', 'Chu vi 100.0 cm'],
        correct: 1,
        exp: 30,
        gold: 24,
        hint: 'Chu vi bằng Bán kính nhân 2 rồi đem kết quả nhân tiếp số Pi xấp xỉ 3.14 dũng sỹ nha.'
      },
      {
        id: 'g5_r1_q5',
        question: 'Dũng sĩ đi xe máy tuần tra với vận tốc đều 40 km/giờ. Hỏi sau 2,5 giờ đi dũng sỹ lướt mấy km?',
        answers: ['Quãng đường dài 100 km', 'Quãng đường dài 80 km', 'Quãng đường dài 120 km', 'Quãng đường dài 90 km'],
        correct: 0,
        exp: 30,
        gold: 24,
        hint: 'Lấy vận tốc nhân dốc với mốc thời gian hành quân rèn mười ngón (s = v * t).'
      }
    ],
    region_2: [ // Lâu Đài Tin Học - Lớp 5 (Bo mạch chính CPU, địa chỉ IP, LAN viết tắt, bộ nhớ RAM tạm thời, WinOS thông trị)
      {
        id: 'g5_r2_q1',
        question: 'Khối linh kiện trung tâm ngự trị điều khiển xử lý thuật toán tối cao của máy vi tính ví như bộ não là?',
        answers: ['Thanh RAM lưu trữ tạm', 'Bộ vi xử lý Chip CPU', 'Ổ đĩa cứng SSD', 'Cục nguồn AC'],
        correct: 1,
        exp: 30,
        gold: 24,
        hint: 'Viết tắt tiếng anh từ cụm Central Processing Unit - đơn vị xử lý bộ trung tâm.'
      },
      {
        id: 'g5_r2_q2',
        question: 'Định thức dải số đánh dấu mốc định danh duy nhất của từng máy tính lướt web trên toàn cầu là?',
        answers: ['Địa chỉ IP an sinh máy', 'Mã quét điểm QR', 'Địa chỉ hộp thư điện tử Gmail', 'Địa chỉ chứng minh thư dũng sĩ'],
        correct: 0,
        exp: 30,
        gold: 24,
        hint: 'Viết tắt cụm từ Internet Protocol - giao thức mạng phân tách số định vị.'
      },
      {
        id: 'g5_r2_q3',
        question: 'Thuật ngữ tin học LAN trong mạng máy tính có nghĩa tiếng Anh là gì dũng sĩ?',
        answers: ['Local Area Network (Mạng cục bộ hẹp)', 'Laptop Auto Net', 'Long Active Node', 'Level Area Router'],
        correct: 0,
        exp: 30,
        gold: 24,
        hint: 'Sơ đồ mạng kết nối nội bộ khu văn phòng làm bài, phạm vi cự ly ngắn.'
      },
      {
        id: 'g5_r2_q4',
        question: 'Bộ nhớ tạm tốc độ cao của máy tính tự dập tắt sạch dữ liệu chứa đựng khi mất nguồn điện là gì?',
        answers: ['Thanh RAM máy tính', 'Ổ cứng lưu trữ HDD', 'USB sao chép', 'Bộ vi CPU nạp'],
        correct: 0,
        exp: 30,
        gold: 24,
        hint: 'Bộ nhớ truy xuất ngẫu nhiên tạm thời, khởi động lại máy là xóa dữ liệu rác lập tức.'
      },
      {
        id: 'g5_r2_q5',
        question: 'Hệ tinh hoa quản điều hành máy tinh học thông dụng được cài đặt rộng khắp nhất Việt Nam?',
        answers: ['Hệ điều phối Windows thịnh đạt', 'Hệ điều phối Android di động', 'Hệ điều phối iOS táo khuyết', 'Hệ điều phối Linux mở rộng'],
        correct: 0,
        exp: 30,
        gold: 24,
        hint: 'Hệ điều hành của tập đoàn Microsoft, có cửa sổ chuyển động rực rỡ bảo hộ học bài.'
      }
    ],
    region_3: [ // Vùng Băng Giá Logic - Lớp 5 (Sên bứt tốc mốc 4 ngày đêm, Broadcast Scratch gửi tin nhắn điều khiển, chạy vượt nhì đứng nhì, bao lộc lì xì, 3 khối nặng mượt)
      {
        id: 'g5_r3_q1',
        question: 'Chú sên leo cột mác sắt cao 10m. Ban ngày sên rướn dẻo lên 4m, đêm uể oải trượt sa xuống 2m. Mấy ngày đêm chạm đỉnh?',
        answers: ['Mất dải 5 ngày đêm', 'Mất dải 4 ngày đêm chính xác', 'Mất dải 3 ngày đêm', 'Mất dải 6 ngày đêm'],
        correct: 1,
        exp: 30,
        gold: 24,
        hint: 'Mỗi vòng ngày đêm tiến rảnh 2m. Tới mốc sới ngày thứ tư lên cao thêm 4m đã chạm chỉ tiêu 10m đỉnh cột sắt!'
      },
      {
        id: 'g5_r3_q2',
        question: 'Cơ chế phát tin nhắn ngầm "Broadcast" trong lập trình Scratch rốt cuộc giúp dũng sỹ tư duy điều gì?',
        answers: [
          'Gửi truyền tín hiệu đồng loạt để kích hoạt kịch bản đồng bộ giữa muôn nhân vật',
          'Gọi điện thoại ra ngoài thế giới',
          'Tự dọn rác bàn phím dũng sỹ',
          'Tải về rương báu mười ngón tay'
        ],
        correct: 0,
        exp: 30,
        gold: 24,
        hint: 'Dùng như phát thanh viên gào dặn báo tin cho muôn kịch nhân cùng thực thi lăng hoạt họa.'
      },
      {
        id: 'g5_r3_q3',
        question: 'Bứt tốc thần kỳ, dũng sỹ tí hon lướt nhanh vượt ngoạn mục người đang đứng ở vị trí thứ NHÌ. Bé đứng thứ mấy?',
        answers: ['Đứng vị trí thứ Nhất hoành tráng', 'Đứng vị trí thứ Nhì tự hào', 'Đứng vị trí thứ Ba oai vệ', 'Đứng vị trí chốt cuối'],
        correct: 1,
        exp: 30,
        gold: 24,
        hint: 'Vượt người gác thứ nhì, dũng sỹ vươn tay thế giữ chỗ chính vị trí của họ.'
      },
      {
        id: 'g5_r3_q4',
        question: 'Trong túi bao lì xì đỏ của bé đựng 5 tờ tiền mệnh giá: 10k, 20k, 50k, 100k, 200k. Rút hú họa ra 1 tờ, sự kiện nào chắc chắn?',
        answers: [
          'Tờ tiền rút được có giá trị dưới mốc 500k',
          'Nhất định rút được tờ chói đỏ tươi',
          'Chuẩn chỉ rút được tờ 500k vàng bóng',
          'Tuyệt đối rút được đúng phóc tờ 100k'
        ],
        correct: 0,
        exp: 30,
        gold: 24,
        hint: 'Vì tờ tiền to đỉnh nhất chỉ có giá 200k, nên cam đoan tờ bốc trúng luôn bé hơn 500k.'
      },
      {
        id: 'g5_r3_q5',
        question: 'Ký tự khối hộp nặng xếp: Hộp X nặng hơn hộp Y, hộp Y nặng hơn hộp Z. Thiết kế hộp nào nhỏ bé nhẹ nhất?',
        answers: ['Khối học hộp X', 'Khối học hộp Y', 'Khối học hộp Z', 'Cân nặng X và Z bằng phẳng nhau'],
        correct: 2,
        exp: 30,
        gold: 24,
        hint: 'Hộp Z nhẹ cân hơn cả hộp Y, mà hộp Y đã chịu lép vế đứng dưới hộp X.'
      }
    ],
    region_4: [ // Núi Lửa Tư Duy - Lớp 5 (Sao mộc Jupiter to nhất, quả táo Newton, lưới 220V, sóng âm khuyết chân không vũ trụ, bóng tối)
      {
        id: 'g5_r4_q1',
        question: 'Trong chín hành tinh vây quanh Thái Dương Hệ, ngôi sao khổng lồ có kích thước nặng nề lớn nhất?',
        answers: ['Sao Mộc vĩ đại (Jupiter)', 'Sao Thổ bảnh bao có vành đai', 'Địa cầu Trái Đất xanh mát', 'Sao Hỏa đỏ mọng'],
        correct: 0,
        exp: 30,
        gold: 24,
        hint: 'Thiên tinh khổng lồ chứa bão xoáy khổng lồ mang màu sắc cam lằn sọc.'
      },
      {
        id: 'g5_r4_q2',
        question: 'Nhà thiên tài người Anh phác thảo lập nên định luật Thuyết Vạn Vật Hấp Dẫn là nhà khoa học đại tài nào?',
        answers: ['Nhà vật lý Isaac Newton', 'Nhà vật lý Albert Einstein', 'Nhà bác học Galileo Galilei', 'Nhà phát minh Thomas Edison'],
        correct: 0,
        exp: 30,
        gold: 24,
        hint: 'Gắn liền cột mốc lịch sử quả táo rụng mộc trong vường tự hỏi: Vì sao táo lại sa rơi thẳng hướng đất?'
      },
      {
        id: 'g5_r4_q3',
        question: 'Nguồn điện đi dây phục vụ sạc điện máy móc học bài sinh hoạt Việt Nam có chỉ thế áp tiêu chuẩn là?',
        answers: ['Mức điện áp tiêu chuẩn 220 V', 'Mức điện áp tiêu chuẩn 110 V', 'Mức điện áp tiêu chuẩn 380 V', 'Mức điện áp sạc nhỏ 5 V'],
        correct: 0,
        exp: 30,
        gold: 24,
        hint: 'Hiệu thế định danh mức xoay chiều cấp điện rộng khắp phục vụ tin văn phòng mười ngón.'
      },
      {
        id: 'g5_r4_q4',
        question: 'Tại sao âm rung tiếng hét dũng sĩ không thể lan truyền kêu cứu ngoài vùng vũ trụ sâu xa?',
        answers: [
          'Vũ trụ là khoảng không chân không không có hạt phân tử trung gian dẫn truyền sóng cơ',
          'Do nhiệt thế vũ trụ quá lạnh ngắt',
          'Vì màng nhĩ tai bách chiến bị đông đông cứng',
          'Tên lửa gầm rống lấn át tiếng thét dũng sỹ'
        ],
        correct: 0,
        exp: 30,
        gold: 24,
        hint: 'Âm thanh cần môi trường vật chất rắn, lỏng hoặc khí có mật độ hạt đàn hồi để rung lướt sóng.'
      },
      {
        id: 'g5_r4_q5',
        question: 'Bé chiếu chiếc đèn pin rọi thẳng vào một quả bóng bàn nhựa đục kín. Phía sau bóng sẽ lập nên miền gì?',
        answers: ['Vùng bóng tối (bóng râm khuyết sáng)', 'Vệt màu hoa cầu vồng', 'Điểm lửa bốc hơi sùng sực', 'Miền phản xạ gương lóng lánh'],
        correct: 0,
        exp: 30,
        gold: 24,
        hint: 'Bóng bàn che chắn dập tắt tia sáng tuyến thẳng tắp đi qua tạo nên mảng tối đen sau vật.'
      }
    ],
    region_5: [ // Đảo Rồng MOS - Lớp 5 (Excel Vlookup, Ctrl+J dọc lề cân đều, Count chỉ chứa số, docx báu, insert table)
      {
        id: 'g5_r5_q1',
        question: 'Вên lề văn phòng Excel nâng cấp, hàm tra cứu dữ liệu dọc dựa vào cột then chốt mấu chốt là?',
        answers: ['Chiêu thức hàm VLOOKUP', 'Chiêu thức hàm HLOOKUP nằm ngang', 'Sự kết hợpINDEX-MATCH', 'Mệnh đề logic IF kiểm toán'],
        correct: 0,
        exp: 30,
        gold: 24,
        hint: 'Chữ cái V đầu tiền là từ viết tắt của Vertical nghĩa dọc đứng dũng sỹ.'
      },
      {
        id: 'g5_r5_q2',
        question: 'Bé muốn căn dòng văn bản bài vở Word dạt thẳng thớp đều mượt cả hai mép lề dứt khoát, tay nhấn?',
        answers: ['Tổ hợp phím Ctrl + J (Justify)', 'Tổ hợp phím Ctrl + E bến giữa', 'Tổ hợp phím Ctrl + L bến trái', 'Tổ hợp phím Ctrl + R bến phải'],
        correct: 0,
        exp: 30,
        gold: 24,
        hint: 'Phím gộp chữ J bắt đầu từ tên khoa học của sự canh đều lề Justify.'
      },
      {
        id: 'g5_r5_q3',
        question: 'Để kiểm tổng đếm số lượng các ô chỉ chứa dữ liệu mốc sỹ SỐ trong bảng Excel, dũng sỹ gõ?',
        answers: ['Hàm đếm COUNT mộc', 'Hàm đếm COUNTA tất thảy', 'Hàm toán SUM gộp', 'Hàm tra MAX đỉnh'],
        correct: 0,
        exp: 30,
        gold: 24,
        hint: 'COUNT là hàm toán học chuyên rạch số đếm đơn nguyên các ô chứa con số lành mạnh.'
      },
      {
        id: 'g5_r5_q4',
        question: 'Phôi đuôi mở rộng định dạng tên tệp lưu tài văn soạn Word thời đại mới thông dụng là?',
        answers: ['Đuôi định dạng .docx mượt', 'Đuôi định định dạng .xlsx', 'Đuôi định dạng .pptx thuyết trình', 'Đuôi dữ liệu phẳng .pdf'],
        correct: 0,
        exp: 30,
        gold: 24,
        hint: 'Có thêm chữ thập x đính sau cụm cũ nhằm nâng cấp bảo bảo nén văn bản mượt mười ngón.'
      },
      {
        id: 'g5_r5_q5',
        question: 'Để vẽ nhanh ghép một tấm bảng dòng cột biểu kiểm bài thi vào văn trang Word dũng sỹ dùng?',
        answers: ['Thẻ Insert rồi chọn mở Table tạo bảng', 'Thẻ dán Word Home rèn cỡ', 'Thẻ bóng bìa Design trang', 'Thẻ tra ngữ nghĩa Review dịch'],
        correct: 0,
        exp: 30,
        gold: 24,
        hint: 'Trong tiếng anh, từ Table được dùng để chỉ tấm bản vẽ có dòng dọc cột ngang ngay ngắn.'
      }
    ],
    region_6: [ // Vương Quốc AI - Lớp 5 (Python List ngoặc vuông, dũng sĩ sử dụng AI hiểu sâu học, python thăng # bình luận, thuật toán Algorithm, bool logic)
      {
        id: 'g5_r6_q1',
        question: 'Trong Python, kiểu gộp chứa danh sách các vật phần tử bao quanh bởi ngoặc vuông dạng `[1, 2, 3]` là?',
        answers: ['Kiểu dữ liệu Danh sách (List)', 'Bộ lưu trữ Dictionary cặp khóa', 'Bản ghi chuỗi chữ bọc', 'Bảng gán thông tin dải'],
        correct: 0,
        exp: 30,
        gold: 24,
        hint: 'Kiểu mảng dữ liệu List cho phép dũng sĩ thay tháo lắp ghép thêm bớt item tùy thích dẻo dai.'
      },
      {
        id: 'g5_r6_q2',
        question: 'Hành vi sử dụng trí tuệ nhân tạo (AI) học tập có văn hóa văn minh nhất của học sinh dũng sĩ?',
        answers: [
          'Dùng AI để dịch nghĩa khó, hỏi han gợi ý suy lý để tự mình nặn bài tìm hiểu sâu bản chất thức',
          'Sao chép bừa bãi kết quả trọn vẹn nộp thầy cô lười vận động não',
          'Kêu gọi AI thiết kế lời đùa thô tục mỉa bạn cùng trường',
          'Gieo rắc mã độc đột dập tệp tin máy mười ngón'
        ],
        correct: 0,
        exp: 30,
        gold: 24,
        hint: 'AI là đôi ánh cánh trợ đỡ tri thức, dũng sỹ cần tự rèn tâm trí tư duy độc lập mới vững tương lai.'
      },
      {
        id: 'g5_r6_q3',
        question: 'Để biểu diễn dòng chú thích diễn giải mã lệnh mà máy Python bỏ đi không biên chạy, dũng sỹ dùng?',
        answers: ['Ký tự dải thăng đại diện #', 'Cặp sườn gạch chéo chéo //', 'Dấu đóng chấm phẩy ;', 'Dấu cặp ngoặc nháy kép bọc'],
        correct: 0,
        exp: 30,
        gold: 24,
        hint: 'Sử dụng ký hiệu hashtag thăng để chuyển đổi sắc diện dòng chú thích tắp đẹp đẽ.'
      },
      {
        id: 'g5_r6_q4',
        question: 'Dãy các khối chỉ dẫn dại bước đi logic rõ ràng để sáp giải quyết bài toán mười ngón gọi là gì?',
        answers: ['Thuật toán chuẩn chỉ (Algorithm)', 'Dữ liệu sơ cấp phẳng', 'Bảng thông truyền IP', 'Tham số chỉ mác sườn máy'],
        correct: 0,
        exp: 30,
        gold: 24,
        hint: 'Trình tự các bước giải toán tuyệt mỹ được viết nên để robot hay máy tính làm theo trơn tru.'
      },
      {
        id: 'g5_r6_q5',
        question: 'Mác biến logic trong code chỉ nhận hai giá trị duy nhất tuyệt đối Đúng (True) hoặc Sai (False) gõ là?',
        answers: ['Kiểu dữ liệu Boolean (bool)', 'Kiểu chuỗi String văn', 'Kiểu tích số Integer số nguyên', 'Kiểu dải tập hợp mảng List'],
        correct: 0,
        exp: 30,
        gold: 24,
        hint: 'Bắt nguồn từ danh xưng nhà đại số học kỳ tài George Boole kiến tạo nên nền tảng đúng sai nhị phân.'
      }
    ]
  }
};

// Hàm lấy câu hỏi ngẫu nhiên dựa trên phân vùng grade và regionId, hổ trợ tránh trùng lặp câu hỏi dũng sĩ
export function getRandomQuestion(
  regionId: string,
  gradeLevel: 'grade_1' | 'grade_2' | 'grade_3' | 'grade_4' | 'grade_5' = 'grade_1',
  excludeIds?: string[]
): Question {
  const gradeData = QUESTIONS_BY_GRADE_AND_REGION[gradeLevel] || QUESTIONS_BY_GRADE_AND_REGION['grade_1'];
  const list = gradeData[regionId] || gradeData['region_1'];
  
  if (!list || list.length === 0) {
    // Fallback if empty
    return {
      id: 'fallback_q',
      question: 'Tin học là môn học bổ ích giúp em làm chủ kỹ năng số tương lai đúng không?',
      answers: ['Chắc chắn rồi!', 'Có thể', 'Không đúng', 'Nhạt nhẽo'],
      correct: 0,
      exp: 15,
      gold: 10,
      hint: 'Hãy tự tin đồng ý để nạp năng lượng tiến bước!'
    };
  }

  // Lọc bỏ các câu hỏi dũng sĩ đã trả lời trong lượt này để tránh trùng
  let filteredList = list;
  if (excludeIds && excludeIds.length > 0) {
    filteredList = list.filter((q) => !excludeIds.includes(q.id));
  }
  if (filteredList.length === 0) {
    filteredList = list; // Quay vòng lại nếu đã trả lời sạch câu hỏi
  }

  const randomIndex = Math.floor(Math.random() * filteredList.length);
  return filteredList[randomIndex];
}
