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
    region_1: [ // Rừng Toán Học - Lớp 1
      {
        id: 'g1_r1_q1',
        question: 'Phép tính nào sau đây có kết quả bằng 5?',
        answers: ['2 + 3', '1 + 2', '4 - 1', '5 + 1'],
        correct: 0,
        exp: 15,
        gold: 10,
        hint: 'Xòe bàn tay trái có 2 ngón, bàn tay phải thêm 3 ngón bàn tay...'
      },
      {
        id: 'g1_r1_q2',
        question: 'Mẹ mua cho Nam 8 quả táo, Nam ăn hết 3 quả. Hỏi Nam còn lại mấy quả táo?',
        answers: ['11 quả', '5 quả', '6 quả', '4 quả'],
        correct: 1,
        exp: 15,
        gold: 10,
        hint: 'Phép trừ: 8 bớt đi 3 bằng bao nhiêu quả táo nhỉ?'
      },
      {
        id: 'g1_r1_q3',
        question: 'Tìm x biết: 10 - x = 4',
        answers: ['x = 6', 'x = 5', 'x = 7', 'x = 3'],
        correct: 0,
        exp: 15,
        gold: 10,
        hint: 'If em có 10 nghìn đồng và tiêu hết x nghìn còn 4 nghìn, em hết mấy?'
      },
      {
        id: 'g1_r1_q4',
        question: 'Số liền sau của số 9 là số nào?',
        answers: ['Số 8', 'Số 10', 'Số 11', 'Số 7'],
        correct: 1,
        exp: 15,
        gold: 10,
        hint: 'Đếm tiếp thêm 1 sau số khuyên tai 9.'
      },
      {
        id: 'g1_r1_q5',
        question: 'Hình dạng nào dưới đây có chính xác 3 góc và 3 cạnh thẳng?',
        answers: ['Hình tròn', 'Hình vuông', 'Hình tam giác', 'Hình chữ nhật'],
        correct: 2,
        exp: 15,
        gold: 10,
        hint: 'Giống như mái nhà che chở nắng mưa hoặc hình ảnh chiếc bánh chưng cắt góc.'
      }
    ],
    region_2: [ // Lâu Đài Tin Học - Lớp 1
      {
        id: 'g1_r2_q1',
        question: 'Thiết bị nào sau đây dùng để nhập chữ cái và số vào máy tính?',
        answers: ['Chuột máy tính', 'Bàn phím máy tính', 'Loa phát nhạc', 'Màn hình hiển thị'],
        correct: 1,
        exp: 15,
        gold: 10,
        hint: 'Nơi có các phím bấm A, B, C và phím số của bé.'
      },
      {
        id: 'g1_r2_q2',
        question: 'Chuột máy tính giúp em làm gì trên màn hình?',
        answers: ['Phát ra âm thanh bài hát', 'Điều khiển mũi tên chỉ và chọn các biểu tượng', 'Lọc sạch bụi trên màn hình', 'In giấy khen học tập'],
        correct: 1,
        exp: 15,
        gold: 10,
        hint: 'Khi di chuyển bàn tay cầm chuột, mũi tên trên màn hình cũng chuyển động theo.'
      },
      {
        id: 'g1_r2_q3',
        question: 'Để gõ khoảng trắng (cách chữ) giữa hai từ, em dùng phím nào dưới đây?',
        answers: ['Phím cách dài nhất hàng dưới', 'Phím Enter vuông tròn', 'Phím Caps Lock viết viết hoa', 'Phím số 1'],
        correct: 0,
        exp: 15,
        gold: 10,
        hint: 'Phím dẹt hình chữ nhật rất dài ở hàng phím thấp nhất.'
      },
      {
        id: 'g1_r2_q4',
        question: 'Để bật hoặc tắt máy tính để bàn, em bấm vào nút nào trên thân máy?',
        answers: ['Nút nguồn (Power button)', 'Phím Space trên bàn phím', 'Phím xóa Backspace', 'Nút chuột trái'],
        correct: 0,
        exp: 15,
        gold: 10,
        hint: 'Nút to tròn có biểu tượng một vòng tròn khuyết và gạch dọc sáng đèn.'
      },
      {
        id: 'g1_r2_q5',
        question: 'Chúng ta nên giữ khoảng cách từ mắt đến màn hình máy tính khoảng bao nhiêu là an toàn?',
        answers: ['Đặt mắt sát sạt vào màn hình', 'Khoảng 50 cm đến 80 cm (gần bằng một sải tay bé)', 'Không cần khoảng cách nào', 'Nhắm mắt lại khi nhìn'],
        correct: 1,
        exp: 15,
        gold: 10,
        hint: 'Khoảng bằng một tầm tay duỗi dài của bé để bảo vệ thủy tinh thể.'
      }
    ],
    region_3: [ // Vùng Băng Giá Logic - Lớp 1
      {
        id: 'g1_r3_q1',
        question: 'Nếu quả táo có màu đỏ, quả chuối có màu vàng, thì quả chuối có màu gì?',
        answers: ['Màu đỏ', 'Màu xanh lá', 'Màu vàng óng', 'Màu hồng ngọc'],
        correct: 2,
        exp: 15,
        gold: 10,
        hint: 'Đọc kỹ đề bài để thấy màu sắc của quả chuối em nhé!'
      },
      {
        id: 'g1_r3_q2',
        question: 'Hãy điền hình thích hợp vào chỗ trống: Hình Tròn - Hình Vuông - Hình Tròn - Hình Vuông - ...?',
        answers: ['Hình Tròn', 'Hình Tam Giác', 'Hình Trái Tim', 'Hình Ngôi Sao'],
        correct: 0,
        exp: 15,
        gold: 10,
        hint: 'Quy luật lặp lại luân phiên giữa tròn và vuông.'
      },
      {
        id: 'g1_r3_q3',
        question: 'Nếu hôm nay là thứ Hai thì ngày mai là thứ mấy?',
        answers: ['Thứ Ba', 'Thứ Tư', 'Chủ Nhật', 'Thứ Bảy'],
        correct: 0,
        exp: 15,
        gold: 10,
        hint: 'Kế tiếp sau thứ Hai trong tuần là ngày nào bé nhỉ?'
      },
      {
        id: 'g1_r3_q4',
        question: 'Nhà Lan nuôi 3 con mèo. Nhà Tuấn nuôi 2 con mèo. Hỏi cả hai nhà nuôi tất cả mấy con mèo?',
        answers: ['5 con mèo', '4 con mèo', '6 con mèo', '3 con mèo'],
        correct: 0,
        exp: 15,
        gold: 10,
        hint: 'Bé thực hiện phép cộng gộp số mèo của cả hai ngôi nhà dũng sĩ lại nhé!'
      },
      {
        id: 'g1_r3_q5',
        question: 'Ai là người hướng dẫn bé học tập, canh giữ tri thức và chấm thưởng tại lớp học Sao Việt?',
        answers: ['Chú bảo vệ đáng yêu', 'Thầy giáo hoặc cô giáo dạy tin học', 'Bạn học sinh cùng bàn', 'Hệ thống tự động hoàn toàn'],
        correct: 1,
        exp: 15,
        gold: 10,
        hint: 'Giáo viên luôn ân cần chỉ dẫn và đồng hành dắt tay bé thực hành mười ngón tay!'
      }
    ],
    region_4: [ // Núi Lửa Tư Duy - Lớp 1
      {
        id: 'g1_r4_q1',
        question: 'Cây xanh cần điều gì nhất dưới đây để sinh trưởng tươi tốt?',
        answers: ['Ánh sáng mặt trời và nước', 'Nước ngọt có ga', 'Sữa chua dâu tây', 'Đồ chơi robot'],
        correct: 0,
        exp: 15,
        gold: 10,
        hint: 'Cây cối tự nhiên cần nước uống và ánh nắng ban mai rực rỡ.'
      },
      {
        id: 'g1_r4_q2',
        question: 'Ông mặt trời tỏa sáng rực rỡ sưởi ấm vạn vật vào ban nào?',
        answers: ['Ban Đêm tối mịt', 'Ban ngày nắng ấm', 'Lúc đi ngủ sâu', 'Lúc trăng rằm tròn'],
        correct: 1,
        exp: 15,
        gold: 10,
        hint: 'Mặt trời xuất hiện khi bình minh ló rạng để bắt đầu ngày học tập mới.'
      },
      {
        id: 'g1_r4_q3',
        question: 'Khi bé thả một chiếc thuyền giấy vào nước phẳng lặng, điều gì xảy ra?',
        answers: ['Thuyền giấy sẽ nổi tự do trên mặt nước', 'Thuyền giấy chìm xuống đáy ngay lập tức', 'Thuyền giấy biến hóa thành sắt thép', 'Thuyền giấy bốc khói bùng cháy'],
        correct: 0,
        exp: 15,
        gold: 10,
        hint: 'Xác giấy nhẹ chứa không khí nổi trên mặt nước trước khi bị ngấm sũng nước mềm nhũn.'
      },
      {
        id: 'g1_r4_q4',
        question: 'Con vật nuôi nào đứng gáy tiếng ò ó o vang dội gọi mọi người thức dậy ban mai?',
        answers: ['Con mèo mun', 'Con cún con', 'Con gà trống', 'Con chim bồ câu'],
        correct: 2,
        exp: 15,
        gold: 10,
        hint: 'Chú gà trống oai vệ đón bình minh thức giấc cùng dũng dũng sĩ.'
      }
    ],
    region_5: [ // Đảo Rồng MOS - Lớp 1
      {
        id: 'g1_r5_q1',
        question: 'Để xóa một chữ viết sai khi gõ văn bản, em dùng phím nào?',
        answers: ['Phím Backspace (phím xóa lùi bên phải)', 'Phím Shift', 'Phím cách Space', 'Phím Alt'],
        correct: 0,
        exp: 15,
        gold: 10,
        hint: 'Phím nằm ở góc trên bên phải khu chữ cái, thường có dấu mũi tên xoay về bên trái.'
      },
      {
        id: 'g1_r5_q2',
        question: 'Để làm bài trình chiếu bài học đẹp mắt trên màn hình tivi, thầy cô dùng phần mềm nào?',
        answers: ['PowerPoint thuyết trình', 'Máy tính Calculator', 'Phần mềm Paint vẽ hình', 'Trình duyệt Web'],
        correct: 0,
        exp: 15,
        gold: 10,
        hint: 'Phần mềm có biểu tượng màu đỏ cam chữ P lớn, chuyên chiếu slide bài giảng.'
      },
      {
        id: 'g1_r5_q3',
        question: 'Phần mềm Microsoft Word có màn hình màu trắng giống trang học bạ giúp bé luyện tập gì?',
        answers: ['Luyện tập soạn thảo gõ văn bản chữ viết', 'Tô màu vẽ tranh phong cảnh bằng cọ', 'Xem phim hoạt hình Tom và Jerry', 'Lắp ráp mô hình đồ dùng Lego'],
        correct: 0,
        exp: 15,
        gold: 10,
        hint: 'Hỗ trợ viết chữ lưu giữ kiến thức, viết thư tay, làm tiểu luận tài liệu học tập.'
      },
      {
        id: 'g1_r5_q4',
        question: 'Khi luyện gõ chữ văn bản trên bàn phím, tư thế ngồi như thế nào là đạt chuẩn khoa học tốt cho cột sống?',
        answers: ['Nằm uể oải gối đầu trên bàn', 'Ngồi thẳng lưng tự nhiên, mắt ngang tầm màn hình, chân chạm đất song song', 'Ngẹo sang một bên tựa gác vai', 'Cúi sát mắt cách màn hình dưới 10cm'],
        correct: 1,
        exp: 15,
        gold: 10,
        hint: 'Nên ngồi thẳng tự tin như anh hùng bảo vệ bờ lãnh thổ bờ bến quốc gia.'
      }
    ],
    region_6: [ // Vương Quốc AI - Lớp 1
      {
        id: 'g1_r6_q1',
        question: 'Dòng máy tính thông minh biết làm toán và trả lời câu hỏi tự động được gọi là gì?',
        answers: ['Robot Trí tuệ Nhân tạo (AI)', 'Cái tivi cũ', 'Bóng đèn điện', 'Bút lông màu'],
        correct: 0,
        exp: 15,
        gold: 10,
        hint: 'Máy tính có bộ não kỹ thuật số do con người rèn luyện viết tắt là AI.'
      },
      {
        id: 'g1_r6_q2',
        question: 'Mô hình robot thông minh AI có thể hỗ trợ em việc gì?',
        answers: ['Giúp em giải thích bài toán khó và học từ vựng', 'Đi bộ ra chợ mua rau thay em', 'Uống sữa hộ em', 'Quay lại thời gian về năm ngoái'],
        correct: 0,
        exp: 15,
        gold: 10,
        hint: 'AI là trợ thủ đồng hành tri thức siêu việt giúp bé tiếp thu bài học dễ hiểu.'
      },
      {
        id: 'g1_r6_q3',
        question: 'Khi muốn trò chuyện hỏi thông tin robot AI thông minh, bé viết câu lệnh đặt câu hỏi vào đâu?',
        answers: ['Gõ câu hỏi vào ô hộp văn bản chat (hộp hội thoại)', 'Nói trầm ngâm nhỏ nhỏ với ổ cứng chuột', 'Vẽ nghệ thuật lên mặt sau điện thoại', 'Đút mẩu giấy vào khe bàn phím'],
        correct: 0,
        exp: 15,
        gold: 10,
        hint: 'Bé gõ câu chữ vào khung chat nằm ngay tầm tay gõ mười ngón!'
      },
      {
        id: 'g1_r6_q4',
        question: 'Nhờ công nghệ siêu việt nào mà robot AI có thể dịch tức thì tiếng Việt sang tiếng Anh lưu loát?',
        answers: ['Kỹ thuật Trí tuệ nhân tạo (AI)', 'Do một bác lập trình viên chui ngủ bên trong tivi', 'Có phép thần chú thần tiên', 'Cuốn từ điển tự động gập mở bằng động cơ'],
        correct: 0,
        exp: 15,
        gold: 10,
        hint: 'Công nghệ mô phỏng mạng nơ-ron học tập giống hệt não người nên rất thông thái.'
      }
    ]
  },
  grade_2: {
    region_1: [ // Rừng Toán Học - Lớp 2
      {
        id: 'g2_r1_q1',
        question: 'Tính nhẩm nhanh tổng sau: 25 + 15 = ?',
        answers: ['30', '35', '40', '50'],
        correct: 2,
        exp: 15,
        gold: 12,
        hint: 'Cộng hàng đơn vị 5+5=10 viết 0 nhớ 1, cộng hàng chục 2+1=3 thêm 1...'
      },
      {
        id: 'g2_r1_q2',
        question: 'Phép nhân nào dưới đây có kết quả bằng 12?',
        answers: ['2 x 6', '3 x 5', '4 x 4', '2 x 5'],
        correct: 0,
        exp: 15,
        gold: 12,
        hint: 'Hãy lướt qua bảng nhân 2 hoặc bảng nhân 3 em đã học nhé!'
      },
      {
        id: 'g2_r1_q3',
        question: 'Có 18 viên kẹo chia đều cho 2 anh em. Mỗi người nhận được bao nhiêu viên?',
        answers: ['7 viên', '8 viên', '9 viên', '10 viên'],
        correct: 2,
        exp: 15,
        gold: 12,
        hint: 'Phép toán chia: lấy 18 chia cho 2.'
      },
      {
        id: 'g2_r1_q4',
        question: 'Số tròn chục lớn nhất có 2 chữ số là số nào?',
        answers: ['Số 80', 'Số 90', 'Số 99', 'Số 100'],
        correct: 1,
        exp: 15,
        gold: 12,
        hint: 'Số kết thúc bằng chữ số 0 tròn trịa và lớn nhất dưới mốc 100.'
      }
    ],
    region_2: [ // Lâu Đài Tin Học - Lớp 2
      {
        id: 'g2_r2_q1',
        question: 'Khi phím Caps Lock sáng đèn, các chữ cái em gõ ra sẽ biến đổi thành kiểu chữ gì?',
        answers: ['Chữ viết IN HOA', 'Chữ viết thường bé tí', 'Chữ cái gạch ngang', 'Chữ nhấp nháy liên tục'],
        correct: 0,
        exp: 15,
        gold: 12,
        hint: 'Dùng để viết các tựa đề IN HOA nổi bật.'
      },
      {
        id: 'g2_r2_q2',
        question: 'Để xuống hàng mới viết một đoạn văn bản khác, em nhấn phím nào?',
        answers: ['Phím Enter', 'Phím Space bar', 'Phím Shift', 'Phím Esc'],
        correct: 0,
        exp: 15,
        gold: 12,
        hint: 'Phím nằm ở cạnh phải bàn phím, có chức năng chuyển dòng ngay lập tức.'
      },
      {
        id: 'g2_r2_q3',
        question: 'Khu vực hiển thị tất cả trò chơi, biểu tượng phần mềm trên máy tính gọi là gì?',
        answers: ['Thùng rác Recycle Bin', 'Màn hình chính Desktop', 'Nút nguồn máy tính', 'Bàn di chuột'],
        correct: 1,
        exp: 15,
        gold: 12,
        hint: 'Nơi có bức ảnh nền đẹp lung linh và chứa các shortcut biểu tượng.'
      },
      {
        id: 'g2_r2_q4',
        question: 'Để gõ nhanh 1 chữ in hoa duy nhất (không muốn bật Caps Lock mãi), em giữ phím nào kèm gõ chữ?',
        answers: ['Phím Shift', 'Phím Alt', 'Phím cách Space', 'Phím Backspace'],
        correct: 0,
        exp: 15,
        gold: 12,
        hint: 'Phím Shift ở góc trái hoặc góc phải bàn phím rèn luyện phối hợp 2 bàn tay.'
      }
    ],
    region_3: [ // Vùng Băng Giá Logic - Lớp 2
      {
        id: 'g2_r3_q1',
        question: 'Chú thỏ trắng Mimi nặng 3kg, chú thỏ nâu Bibi nặng hơn thỏ trắng 1kg. Hỏi thỏ nâu Bibi nặng mấy kilôgam?',
        answers: ['2 kg', '3 kg', '4 kg', '5 kg'],
        correct: 2,
        exp: 15,
        gold: 12,
        hint: 'Thực hiện phép tính cộng: Thỏ trắng + thêm khối lượng chênh lệch.'
      },
      {
        id: 'g2_r3_q2',
        question: 'Nếu em có 3 cây bút chì, được cô giáo tặng thêm 2 cây bút nữa. Bạn Lan mượn mất 1 cây. Hỏi em còn lại mấy cây bút?',
        answers: ['4 cây bút', '3 cây bút', '5 cây bút', '2 cây bút'],
        correct: 0,
        exp: 15,
        gold: 12,
        hint: 'Tính số bút có được lúc sau (3 + 2) rồi trừ đi số bút cho mượn.'
      },
      {
        id: 'g2_r3_q3',
        question: 'Gia đình bé có Bố, Mẹ, Bé và Em trai. Hỏi hôm nay dọn cơm tối cần xếp tất cả mấy cái bát?',
        answers: ['3 cái bát', '2 cái bát', '4 cái bát', '5 cái bát'],
        correct: 2,
        exp: 15,
        gold: 12,
        hint: 'Hãy đếm tổng số thành viên dũng sĩ của cả ngôi nhà nhé!'
      }
    ],
    region_4: [ // Núi Lửa Tư Duy - Lớp 2
      {
        id: 'g2_r4_q1',
        question: 'Loài cá thở bằng cơ quan nào dưới nước để lấy khí ôxi?',
        answers: ['Bằng mũi giống người', 'Bằng đuôi cá vẫy', 'Bằng các mang cá hai bên đầu', 'Bằng vây bơi'],
        correct: 2,
        exp: 15,
        gold: 12,
        hint: 'Bộ phận mang cá mở ra khép vào nhịp nhàng khi cá ngậm nước.'
      },
      {
        id: 'g2_r4_q2',
        question: 'Hành tinh xanh tươi nơi chúng ta đang sinh sống và đi học mỗi ngày có tên là gì?',
        answers: ['Sao Hỏa nóng bỏng', 'Trái Đất thân yêu', 'Mặt Trăng trọc lốc', 'Sao Thủy nhỏ bé'],
        correct: 1,
        exp: 15,
        gold: 12,
        hint: 'Hành tinh thứ ba tính từ Mặt trời, có nước lỏng và bầu khí quyển mát lành.'
      },
      {
        id: 'g2_r4_q3',
        question: 'Vào ngày mùa đông siêu lạnh, nước ở đỉnh núi cao đóng thành băng. Băng là nước ở thể gì?',
        answers: ['Thể Khí bay lơ lửng', 'Thể Lỏng rơi xuống', 'Thể Rắn cứng vững dẻo', 'Thể Sương mù'],
        correct: 2,
        exp: 15,
        gold: 12,
        hint: 'Khi nước lạnh dưới 0 độ C sẽ hóa thành đá rắn, sờ vào thấy lạnh buốt tê tái.'
      }
    ],
    region_5: [ // Đảo Rồng MOS - Lớp 2
      {
        id: 'g2_r5_q1',
        question: 'Để chữ hiển thị IN ĐẬM đen đậm rõ nét trong Microsoft Word, em click vào chữ biểu tượng hình gì trên thanh công cụ?',
        answers: ['Hình chữ B (Bold)', 'Hình chữ I (Italic)', 'Hình chữ U (Underline)', 'Hình cây bút vẽ'],
        correct: 0,
        exp: 15,
        gold: 12,
        hint: 'Chữ cái đầu tiền của từ Bold có nghĩa là Đậm.'
      },
      {
        id: 'g2_r5_q2',
        question: 'Hình chữ nhật nhỏ giao giữa dòng và cột trong Microsoft Excel được gọi là gì?',
        answers: ['Trang tính', 'Một ô tính (Cell)', 'Biểu đồ tròn', 'Công cụ soạn thảo'],
        correct: 1,
        exp: 15,
        gold: 12,
        hint: 'Nơi em nhập các con số tính toán hoặc nhập chữ Excel.'
      },
      {
        id: 'g2_r5_q3',
        question: 'Để viết chữ IN NGHIÊNG cực kỳ điệu nghệ nghệ thuật trong Microsoft Word, em bấm chọn chữ nào?',
        answers: ['Nút chữ B lớn', 'Nút chữ I nghiêng', 'Nút chữ U gạch chân', 'Nút hình ổ màu sơn'],
        correct: 1,
        exp: 15,
        gold: 12,
        hint: 'Bắt đầu bằng chữ I có dáng bay dốc dốc của Italic.'
      }
    ],
    region_6: [ // Vương Quốc AI - Lớp 2
      {
        id: 'g2_r6_q1',
        question: 'Từ AI là viết tắt của tiếng Anh nào?',
        answers: ['Artificial Intelligence (Trí tuệ nhân tạo)', 'Apple Internet', 'Angry Insect', 'Action Indicator'],
        correct: 0,
        exp: 15,
        gold: 12,
        hint: 'Sự thông minh nhân tạo do các kỹ sư tin học lập trình truyền cho máy tính.'
      },
      {
        id: 'g2_r6_q2',
        question: 'Để ra lệnh cho máy tính in ra màn hình một câu dặn dò bằng Python, em viết câu lệnh nào?',
        answers: ['print()', 'show()', 'say()', 'tell()'],
        correct: 0,
        exp: 15,
        gold: 12,
        hint: 'Lệnh in ấn từ vựng tiếng Anh chính là print.'
      },
      {
        id: 'g2_r6_q3',
        question: 'Phần mềm lập trình kéo thả màu sắc thông dụng cho bé có hình đại diện chú mèo vàng thông tuệ tên là ghép gì?',
        answers: ['Scratch kéo thả', 'Excel nhập bảng', 'Paint tô tượng', 'Photoshop ghép ảnh'],
        correct: 0,
        exp: 15,
        gold: 12,
        hint: 'Dùng các mảnh thẻ màu tươi lắp ghép thành trò chơi hoạt họa sống động xuất phát từ viện MIT vĩ đại.'
      }
    ]
  },
  grade_3: {
    region_1: [ // Rừng Toán Học - Lớp 3
      {
        id: 'g3_r1_q1',
        question: 'Một nửa của số 500 là bao nhiêu?',
        answers: ['250', '200', '150', '300'],
        correct: 0,
        exp: 20,
        gold: 15,
        hint: 'Thực hiện phép tính chia số 500 cho 2.'
      },
      {
        id: 'g3_r1_q2',
        question: 'Tính giá trị biểu thức: 40 + 20 x 2',
        answers: ['120', '80', '100', '60'],
        correct: 1,
        exp: 20,
        gold: 15,
        hint: 'Ghi nhớ quy tắc: Nhân chia trước, cộng trừ sau nhé!'
      },
      {
        id: 'g3_r1_q3',
        question: 'Hình vuông có cạnh 5 cm. Chu vi của hình vuông đó là:',
        answers: ['25 cm', '15 cm', '20 cm', '10 cm'],
        correct: 2,
        exp: 20,
        gold: 15,
        hint: 'Chu vi hình vuông bằng độ dài 1 cạnh nhân với 4.'
      },
      {
        id: 'g3_r1_q4',
        question: 'Phép toán chia sau đây có số dư là bao nhiêu: 17 chia cho 3?',
        answers: ['Số dư là 1', 'Số dư là 2', 'Số dư là 0', 'Số dư là 3'],
        correct: 1,
        exp: 20,
        gold: 15,
        hint: 'Hãy nhân nhẩm: 3 x 5 = 15. Lấy 17 trừ đi 15 sẽ ra số dư.'
      }
    ],
    region_2: [ // Lâu Đài Tin Học - Lớp 3
      {
        id: 'g3_r2_q1',
        question: 'Tổ hợp phím tắt nào dùng để sao chép (Copy) đối tượng đã chọn?',
        answers: ['Ctrl + V', 'Ctrl + C', 'Ctrl + X', 'Ctrl + Z'],
        correct: 1,
        exp: 20,
        gold: 15,
        hint: '"C" là viết tắt của từ "Copy" trong tiếng Anh.'
      },
      {
        id: 'g3_r2_q2',
        question: 'Để lưu bài làm Word hoặc PowerPoint vào máy tính nhanh nhất kẻo mất điện, em bấm phím gì?',
        answers: ['Ctrl + S', 'Ctrl + A', 'Ctrl + O', 'Ctrl + N'],
        correct: 0,
        exp: 20,
        gold: 15,
        hint: '"S" là viết tắt của từ "Save" trong tiếng Anh có nghĩa là Lưu trữ.'
      },
      {
        id: 'g3_r2_q3',
        question: 'Thao tác nhấn đúp chuột trái nhanh hai lần liên tiếp (Double Click) có tác dụng gì?',
        answers: ['Mở một tệp tài liệu hoặc phần mềm được chỉ định', 'Xóa tệp tin tức khắc', 'Khởi động lại máy tính', 'Tắt màn hình'],
        correct: 0,
        exp: 20,
        gold: 15,
        hint: 'Bấm kích hoạt nhanh hai nhịp trái để thâm nhập ứng dụng.'
      },
      {
        id: 'g3_r2_q4',
        question: 'Khi máy tính bị đơ (treo cứng), tổ hợp phím nổi tiếng nào giúp mở hộp quản trị hệ thống Task Manager?',
        answers: ['Ctrl + Alt + Delete', 'Ctrl + Shift + Enter', 'Alt + Space', 'Windows + D'],
        correct: 0,
        exp: 20,
        gold: 15,
        hint: 'Sử dụng ba phím thần kỳ ở góc trái thâm nhập vào sâu nhân điều khiển.'
      }
    ],
    region_3: [ // Vùng Băng Giá Logic - Lớp 3
      {
        id: 'g3_r3_q1',
        question: 'Trên một cành mẫu có 5 chú chim đang đậu hót. Chú thợ săn bắn một tiếng đạn nổ làm rơi 1 chú chim. Hỏi trên cành còn lại mấy chú chim?',
        answers: ['4 chú chim', 'Không còn chú nào', '3 chú chim', '2 chú chim'],
        correct: 1,
        exp: 20,
        gold: 15,
        hint: 'Câu đố mẹo logic: Tất cả những chú chim sống sót nghe thấy súng nổ sầm sập sẽ hoảng sợ và...'
      },
      {
        id: 'g3_r3_q2',
        question: 'Trong phần mềm lập trình cho trẻ em Scratch, khối lệnh có hình "Lá cờ xanh" dùng để làm gì?',
        answers: ['Bắt đầu chạy kịch bản/trò chơi', 'Dừng chương trình lập tức', 'Thay đổi màu quần áo nhân vật', 'Xóa dự án đang lưu'],
        correct: 0,
        exp: 20,
        gold: 15,
        hint: 'Nút lá cờ xanh ở góc trên biểu thị khởi chạy chiến dịch lập trình.'
      },
      {
        id: 'g3_r3_q3',
        question: 'Em đi ngủ lúc 9 giờ tối và đặt đồng hồ reo vang lúc 6 giờ sáng hôm sau. Hỏi em ngủ tròn trịa mấy giờ?',
        answers: ['7 giờ ngủ', '8 giờ ngủ', '9 giờ ngủ', '10 giờ ngủ'],
        correct: 2,
        exp: 20,
        gold: 15,
        hint: 'Đếm từ 9 giờ tối qua mốc 12 giờ đêm (bằng 3 tiếng), rồi cộng thêm 6 tiếng sáng sớm.'
      }
    ],
    region_4: [ // Núi Lửa Tư Duy - Lớp 3
      {
        id: 'g3_r4_q1',
        question: 'Hợp chất tự nhiên nào chiếm khoảng 70% tổng khối lượng cơ thể người?',
        answers: ['Dầu thực vật', 'Nước tinh khiết', 'Bột sắt khoáng', 'Nhựa đường dẻo'],
        correct: 1,
        exp: 20,
        gold: 15,
        hint: 'Nước là dung môi thiết yếu tạo máu và nuôi dưỡng các tế bào sinh tồn.'
      },
      {
        id: 'g3_r4_q2',
        question: 'Tại sao em có thể nhìn thấy Cầu Vồng xuất hiện tuyệt đẹp sau cơn mưa giông khi mặt trời hửng nắng?',
        answers: ['Ánh sáng bị phản xạ và khúc xạ qua hàng triệu hạt nước mưa li ti', 'Do cầu vồng tự bay từ vũ trụ xuống mặt đất', 'Vì nước mưa có sẵn màu sắc', 'Phép thuật của quái thú kỳ lân'],
        correct: 0,
        exp: 20,
        gold: 15,
        hint: 'Các hạt nước mưa đóng vai trò như những lăng kính tán sắc phân tích ánh sáng mặt trời thành 7 màu rực rỡ.'
      },
      {
        id: 'g3_r4_q3',
        question: 'Ngôi sao rực cháy to lớn nhất nằm ở tâm Hệ mặt trời sưởi ấm vạn vật Trái Đất là ngôi sao nào?',
        answers: ['Mặt Trời vĩ đại', 'Hố Đen sâu thẳm', 'Sao Thổ có vành', 'Mặt Trăng xám'],
        correct: 0,
        exp: 20,
        gold: 15,
        hint: 'Đại cầu lửa khổng lồ tỏa ánh hoàng kim vàng rực mỗi sớm mai dũng sĩ thức dậy.'
      }
    ],
    region_5: [ // Đảo Rồng MOS - Lớp 3
      {
        id: 'g3_r5_q1',
        question: 'Trong phần mềm bảng tính Microsoft Excel, hàm nào giúp em cộng tổng của một dãy số nhanh chóng?',
        answers: ['Hàm SUM', 'Hàm AVERAGE', 'Hàm MIN', 'Hàm COUNT'],
        correct: 0,
        exp: 20,
        gold: 15,
        hint: 'Hàm lấy tên từ chữ Summation nghĩa là tổng cộng dồn tích.'
      },
      {
        id: 'g3_r5_q2',
        question: 'Để trình chiếu bài thuyết trình của em trên PowerPoint bắt đầu từ slide đầu tiên, em nhấn phím nào trên bàn phím?',
        answers: ['F1', 'F5', 'F11', 'Space bar'],
        correct: 1,
        exp: 20,
        gold: 15,
        hint: 'Phím chức năng hàng đầu tiên, nổi tiếng khởi động Slide Show tức thì.'
      },
      {
        id: 'g3_r5_q3',
        question: 'Trong Word hoặc PowerPoint, để dán một khối vẽ hoặc hình ảnh trang trí vào trang dũng sĩ chọn công cụ nào?',
        answers: ['Thẻ Insert (Chèn) -> Chọn Shapes (Hình học)', 'Thẻ Home -> Đổi font chữ', 'Thẻ Design -> Kiểu phông nền', 'Thẻ Review -> Tra từ tự động'],
        correct: 0,
        exp: 20,
        gold: 15,
        hint: 'Insert có nghĩa là thêm vào, lồng ghép vào văn bản.'
      }
    ],
    region_6: [ // Vương Quốc AI - Lớp 3
      {
        id: 'g3_r6_q1',
        question: 'Khi em gửi tin nhắn yêu cầu hay câu hỏi bổ ích cho mô hình AI, đoạn tin nhắn đó được các kỹ sư gọi là gì?',
        answers: ['Prompt (Khẩu lệnh/Câu lệnh)', 'Hệ phương trình toán học', 'Mật khẩu trang web', 'File virus'],
        correct: 0,
        exp: 20,
        gold: 15,
        hint: 'Đầu vào ngôn ngữ tự nhiên được ghi vào phần chat để hướng dẫn mô hình AI suy nghĩ.'
      },
      {
        id: 'g3_r6_q2',
        question: 'Trong ngôn ngữ lập trình Python, kiểu dữ liệu lưu trữ chuỗi ký tự chữ cái chuẩn được viết tắt là gì?',
        answers: ['int', 'float', 'str (string)', 'bool'],
        correct: 2,
        exp: 20,
        gold: 15,
        hint: 'Dạng chuỗi văn bản ghép từ các chữ, viết tắt của từ string của tiếng Anh.'
      },
      {
        id: 'g3_r6_q3',
        question: 'Để lập trình chú mèo trong Scratch tiến nhanh về phía trước 10 bước dũng sĩ chọn thẻ kéo thả nào?',
        answers: ['Khối lệnh Move 10 steps', 'Khối lệnh Turn Right 15 degrees', 'Khối lệnh Say Hello in 2s', 'Khối lệnh Play Sound Meow'],
        correct: 0,
        exp: 20,
        gold: 15,
        hint: 'Hành động bước đi, dịch chuyển trong tiếng Anh chính là Move.'
      }
    ]
  },
  grade_4: {
    region_1: [ // Rừng Toán Học - Lớp 4
      {
        id: 'g4_r1_q1',
        question: 'Tính chu vi của hình chữ nhật có chiều dài 12 cm và chiều rộng 8 cm.',
        answers: ['20 cm', '40 cm', '96 cm', '80 cm'],
        correct: 1,
        exp: 25,
        gold: 18,
        hint: 'Chu vu = (Chiều dài + Chiều rộng) tất cả nhân 2.'
      },
      {
        id: 'g4_r1_q2',
        question: 'Tính tổng của hai phân số sau: 1/2 + 1/4 = ?',
        answers: ['2/6', '3/4', '1/3', '2/4'],
        correct: 1,
        exp: 25,
        gold: 18,
        hint: 'Hãy quy đồng mẫu số chung là 4, đổi 1/2 thành 2/4 rồi thực hiện phép cộng.'
      },
      {
        id: 'g4_r1_q3',
        question: 'Tìm chữ số x để số 34x chia hết cho cả 2 và 5?',
        answers: ['x = 2', 'x = 5', 'x = 0', 'x = 9'],
        correct: 2,
        exp: 25,
        gold: 18,
        hint: 'Số chia hết cho 5 thì tận cùng bằng 0 hoặc 5, nhưng muốn chia hết cho cả 2 (số chẵn) thì bắt buộc phải là số...'
      },
      {
        id: 'g4_r1_q4',
        question: 'Một hình vuông có diện tích là 36 xăng-ti-mét vuông. Hãy tính độ dài cạnh của hình vuông đó:',
        answers: ['Cạnh bằng 6 cm', 'Cạnh bằng 9 cm', 'Cạnh bằng 18 cm', 'Cạnh bằng 4 cm'],
        correct: 0,
        exp: 25,
        gold: 18,
        hint: 'Diện tích hình vuông = cạnh nhân với chính nó. Hãy nhẩm nhân số tự nhiên nào nhân bản bằng 36.'
      }
    ],
    region_2: [ // Lâu Đài Tin Học - Lớp 4
      {
        id: 'g4_r2_q1',
        question: 'Trong máy tính, thư mục (Folder) dùng để làm gì?',
        answers: ['Chứa các tệp tin bài học ngăn nắp', 'Tự động tính tổng tiền', 'Lọc bụi bẩn bàn phím', 'Phát sáng ban đêm'],
        correct: 0,
        exp: 25,
        gold: 18,
        hint: 'Thư mục đóng vai trò như một chiếc kẹp tài liệu bằng nhựa giúp xếp tập tin khoa học.'
      },
      {
        id: 'g4_r2_q2',
        question: 'Tổ hợp phím tắt nào trong Windows giúp em chuyển đổi nhanh giữa các chương trình ứng dụng đang mở?',
        answers: ['Alt + Tab', 'Ctrl + Alt + Del', 'Ctrl + V', 'Shift + Esc'],
        correct: 0,
        exp: 25,
        gold: 18,
        hint: 'Nhấn đồng thời phím Alt và một phím biểu tượng mũi tên rẽ nhánh bên trái.'
      },
      {
        id: 'g4_r2_q3',
        question: 'Khi gõ chữ tiếng Việt kiểu TELEX, cách gõ hai chữ liên tiếp nào sau đây để tạo ra chữ Â (Ấ)?',
        answers: ['gõ aa', 'gõ aw', 'gõ as', 'gõ ee'],
        correct: 0,
        exp: 25,
        gold: 18,
        hint: 'Sử dụng phím chữ A nhấn hai lần liên rực.'
      },
      {
        id: 'g4_r2_q4',
        question: 'Để kiểm tra các tệp tin trong thiết bị có kết nối mạng, thuật ngữ viết tắt nào chỉ địa chỉ của trang mạng toàn cầu?',
        answers: ['RAM', 'CPU', 'URL / Website', 'ROM'],
        correct: 2,
        exp: 25,
        gold: 18,
        hint: 'Là dòng link địa chỉ dạng https://...'
      }
    ],
    region_3: [ // Vùng Băng Giá Logic - Lớp 4
      {
        id: 'g4_r3_q1',
        question: 'Một gia đình nhỏ có 5 người con trai dũng sỹ, mỗi người con trai đều có chung 1 cô em gái út dễ thương. Hỏi gia đình đó có tổng số bao nhiêu người con?',
        answers: ['10 người con', '6 người con', '8 người con', '5 người con'],
        correct: 1,
        exp: 25,
        gold: 18,
        hint: 'Mỗi người con trai đều tìm thấy chính xác cô em gái đó, nghĩa là chỉ cần một em gái út chung là đủ.'
      },
      {
        id: 'g4_r3_q2',
        question: 'Trong Scratch, khối lệnh "Forever (Liên tục)" có cơ chế hoạt động kỳ diệu như thế nào?',
        answers: ['Chạy các câu lệnh bên trong lặp đi lặp lại mãi mãi không bao giờ dừng', 'Chỉ chạy đúng 1 lần rồi xóa nhân vật', 'Chờ 10 giây mới thực hiện', 'Bật âm nhạc nền ngẫu nhiên'],
        correct: 0,
        exp: 25,
        gold: 18,
        hint: 'Liên tục tức là vòng lặp vô hạn trừ khi bé nhấn nút tròn màu đỏ để ngăn cản trò chơi.'
      },
      {
        id: 'g4_r3_q3',
        question: 'Một cái bể có 5 vòi nước chảy vào. Vòi thứ nhất chảy đầy bể mất 2 tiếng. Hỏi 5 vòi cùng chảy đầy bể sẽ tốn thời gian như thế nào?',
        answers: ['Nhanh hơn rất nhiều (ít hơn 2 tiếng)', 'Lâu hơn rất nhiều', 'Vẫn tốn đúng 2 tiếng', 'Chưa xác định'],
        correct: 0,
        exp: 25,
        gold: 18,
        hint: 'Nhiều vòi cùng tiếp nước dồi dào sẽ giúp bể dâng nước cực nhanh.'
      }
    ],
    region_4: [ // Núi Lửa Tư Duy - Lớp 4
      {
        id: 'g4_r4_q1',
        question: 'Ở điều kiện áp suất thường tại trung tâm, nước lỏng sẽ chuyển đổi sùng sục sôi bốc hơi ở nhiệt độ bao nhiêu độ Celsius?',
        answers: ['50 độ C', '80 độ C', '100 độ C', '200 độ C'],
        correct: 2,
        exp: 25,
        gold: 18,
        hint: 'Mốc nhiệt độ bắt đầu bốc khói hơi sôi nổi cuộn cuộn khi đun nấu.'
      },
      {
        id: 'g4_r4_q2',
        question: 'Khí gas chiếm thể tích nhiều nhất (khoảng 78%) trong không khí bầu khí quyển của chúng ta hít thở là khí gì?',
        answers: ['Khí ôxi (Oxygen)', 'Khí nitơ (Nitrogen)', 'Khí Các-bô-níc (Carbon dioxide)', 'Khí Heli nhẹ nhàng'],
        correct: 1,
        exp: 25,
        gold: 18,
        hint: 'Mặc dù chúng ta lấy khí oxy để hô hấp, nhưng thực tế khí nitơ mới là khí dồi dào che chở xung quanh.'
      },
      {
        id: 'g4_r4_q3',
        question: 'Âm thanh từ tiếng nói dũng sĩ sẽ truyền dẫn đi nhanh nhất khi xuyên qua môi trường vật chất nào dưới đây?',
        answers: ['Chất rắn (Ví dụ như thành thép, tường gạch)', 'Chất lỏng (Nước)', 'Chất khí (Không khí bay lửng)', 'Môi trường chân không'],
        correct: 0,
        exp: 25,
        gold: 18,
        hint: 'Các phân tử ở chất rắn xếp khít nhau giúp truyền đi dao động sóng âm thần tốc.'
      }
    ],
    region_5: [ // Đảo Rồng MOS - Lớp 4
      {
        id: 'g4_r5_q1',
        question: 'Phím tắt nào giúp dán (Paste) nhanh dữ liệu, văn bản hoặc hình ảnh vừa Copy?',
        answers: ['Ctrl + P', 'Ctrl + V', 'Ctrl + C', 'Ctrl + B'],
        correct: 1,
        exp: 25,
        gold: 18,
        hint: 'Tổ hợp nằm cạnh phím C sao chép trên hàng chữ cái bàn phím.'
      },
      {
        id: 'g4_r5_q2',
        question: 'Trong Microsoft Excel, địa chỉ ô chứa ký tự đô la đóng băng như "$A$1" được gọi là loại địa chỉ nào?',
        answers: ['Địa chỉ tương đối dễ thay đổi', 'Địa chỉ tuyệt đối khóa cứng vị trí', 'Địa chỉ hỗn hợp một nửa', 'Địa chỉ ảo ảo ảnh'],
        correct: 1,
        exp: 25,
        gold: 18,
        hint: 'Địa chỉ khóa chặt cả cột và hàng lại không cho chạy lệch khi kéo công thức lây lan.'
      },
      {
        id: 'g4_r5_q3',
        question: 'Trong Excel, để trộn gộp nhiều ô liên tục thành một ô lớn chung, đầu bảng em nhấn chọn nút nào?',
        answers: ['Nút Merge & Center', 'Nút Wrap Text', 'Nút AutoSum', 'Nút Filter'],
        correct: 0,
        exp: 25,
        gold: 18,
        hint: 'Merge có nghĩa là dung hợp trộn lẫn, Center có nghĩa là căn vào giữa.'
      }
    ],
    region_6: [ // Vương Quốc AI - Lớp 4
      {
        id: 'g4_r6_q1',
        question: 'Trợ lý AI đa năng thế hệ mới nhất do Google phát triển có khả năng trò chuyện thông minh tên là gì?',
        answers: ['Gemini', 'Cortana', 'Robo-X', 'DeepMind-Box'],
        correct: 0,
        exp: 25,
        gold: 18,
        hint: 'Lấy tên chòm sao Song Tử trong tiếng Anh, có biểu tượng lấp lánh bốn cánh siêu việt.'
      },
      {
        id: 'g4_r6_q2',
        question: 'Chọn dòng lệnh in văn bản "Học Tin Học Mê Ly" chuẩn cú pháp của ngôn ngữ Python:',
        answers: [
          'print("Học Tin Học Mê Ly")',
          'InRa("Học Tin Học Mê Ly")',
          'print Học Tin Học Mê Ly()',
          'write.text("Học Tin Học Mê Ly")'
        ],
        correct: 0,
        exp: 25,
        gold: 18,
        hint: 'Dùng cấu trúc hàm print có mở rộng ngoặc tròn và trích dẫn chuỗi nháy kép bọc quanh câu.'
      },
      {
        id: 'g4_r6_q3',
        question: 'Trong lập trình Scratch, để nhân vật tự động nảy xoay lại khi di chuyển đụng rìa sân khấu vẽ em kéo thả khối nào?',
        answers: ['Khối lệnh If on edge, bounce', 'Khối lệnh Move 10 steps', 'Khối lệnh Say Hello', 'Khối lệnh Hide'],
        correct: 0,
        exp: 25,
        gold: 18,
        hint: 'Từ edge trong tiếng Anh tức là rìa mép sân khấu, bounce có nghĩa là nảy quả bóng lại.'
      }
    ]
  },
  grade_5: {
    region_1: [ // Rừng Toán Học - Lớp 5
      {
        id: 'g5_r1_q1',
        question: 'Chuyển phân số 4/5 thành số thập phân chính xác:',
        answers: ['0.4', '0.5', '0.8', '1.25'],
        correct: 2,
        exp: 30,
        gold: 24,
        hint: 'Em thực hiện phép tính chia tử cho mẫu: 4 chia cho 5.'
      },
      {
        id: 'g5_r1_q2',
        question: 'Tìm tỉ số phần trăm tích lũy của hai số 15 và 60:',
        answers: ['15%', '25%', '40%', '50%'],
        correct: 1,
        exp: 30,
        gold: 24,
        hint: 'Thực hiện lấy 15 chia cho 60 được bao nhiêu rồi nhân với 100.'
      },
      {
        id: 'g5_r1_q3',
        question: 'Diện tích của hình tam giác có độ dài đáy là 10 cm, chiều cao tương ứng là 8 cm là bao nhiêu?',
        answers: ['80 cm²', '40 cm²', '20 cm²', '18 cm²'],
        correct: 1,
        exp: 30,
        gold: 24,
        hint: 'S tam giác = (Đáy x Chiều cao) chia 2.'
      },
      {
        id: 'g5_r1_q4',
        question: 'Hình tròn có bán kính r = 5 cm. Tính chu vi hình tròn đó (lấy số Pi xấp xỉ bằng 3.14):',
        answers: ['15.7 cm', '31.4 cm', '78.5 cm', '10.0 cm'],
        correct: 1,
        exp: 30,
        gold: 24,
        hint: 'Công thức toán học: Chu vi = Bán kính r nhân 2 rồi nhân với 3.14 (hoặc Đường kính nhân 3.14).'
      }
    ],
    region_2: [ // Lâu Đài Tin Học - Lớp 5
      {
        id: 'g5_r2_q1',
        question: 'Bộ phận phần cứng nào ngự trị trung tâm bo mạch chủ máy tính, chịu trách nhiệm xử lý thuật toán tối cao (được ví như não máy tính)?',
        answers: ['RAM bộ nhớ tạm', 'CPU (Chip xử lý trung tâm)', 'Ổ Đĩa Cứng SSD', 'Nguồn điện'],
        correct: 1,
        exp: 30,
        gold: 24,
        hint: 'Viết tắt của Central Processing Unit, đơn vị điều phối toàn cục tính toán.'
      },
      {
        id: 'g5_r2_q2',
        question: 'Giao thức số định thức xác định duy nhất vị trí kết nối mạng internet của từng thiết bị máy tính gọi là gì?',
        answers: ['Địa chỉ IP (IP Address)', 'Mã vạch QR', 'Địa chỉ email', 'Địa chỉ nhà riêng'],
        correct: 0,
        exp: 30,
        gold: 24,
        hint: 'Internet Protocol chính là giao thức đánh số dải như 192.168.1.1...'
      },
      {
        id: 'g5_r2_q3',
        question: 'Trong mạng máy tính toàn cầu, thuật ngữ viết tắt LAN dùng để chỉ loại mạng nào dưới đây?',
        answers: ['Mạng cục bộ phạm vi nhỏ hẹp', 'Mạng diện rộng toàn cầu', 'Mạng không dây vũ trụ', 'Mạng truyền hình cáp kỹ thuật số'],
        correct: 0,
        exp: 30,
        gold: 24,
        hint: 'Mạng LAN viết tắt của Local Area Network, kết nối máy tính ở văn phòng học tập gần kề.'
      }
    ],
    region_3: [ // Vùng Băng Giá Logic - Lớp 5
      {
        id: 'g5_r3_q1',
        question: 'Một dũng sỹ sên sên cố bò lên ngọn đồi cột sắt cao 10 mét. Ban ngày sên bò tiến lên được 3m, đêm lười rũ đầu tuột xuống 2m. Hỏi sau chính xác bao nhiêu ngày đêm sên chạm được đỉnh cột?',
        answers: ['10 ngày đêm', '9 ngày đêm', '8 ngày đêm', '7 ngày đêm'],
        correct: 2,
        exp: 30,
        gold: 24,
        hint: 'Mỗi ngày sên tiến ròng rã 1m. Tới ngày thứ 8 ban ngày sên rướn lên 3m đã chạm mốc 10m trước khi đêm sập xuống gây tuột rơi!'
      },
      {
        id: 'g5_r3_q2',
        question: 'Trong cấu trúc dữ liệu Scratch, tính năng "Broadcast (Phát tin nhắn)" hoạt động ra sao?',
        answers: [
          'Gửi một tín hiệu bí mật tới toàn bộ nhân vật để cùng nhận và kích hoạt hoạt họa kịch bản đồng bộ',
          'Gọi điện thoại ra ngoài đời thực cho thầy cô',
          'In tài liệu ra giấy',
          'Tự động tăng vàng trong tài khoản'
        ],
        correct: 0,
        exp: 30,
        gold: 24,
        hint: 'Là công cụ phát sóng truyền tin ngầm giúp điều phối tương tác giữa các sprite.'
      },
      {
        id: 'g5_r3_q3',
        question: 'Trong một cuộc thi chạy tiếp sức khốc liệt, nếu dũng sỹ chạy bứt tốc vượt qua người đang ở vị trí thứ NHÌ, em sẽ vươn lên đứng ở vị trí thứ mấy?',
        answers: ['Vị trí thứ Nhất', 'Vị trí thứ Nhì', 'Vị trí thứ Ba', 'Vị trí cuối cùng'],
        correct: 1,
        exp: 30,
        gold: 24,
        hint: 'Bằng cách vượt qua người xếp thứ hai, em chiếm chính xác vị trí thứ nhì của họ.'
      }
    ],
    region_4: [ // Núi Lửa Tư Duy - Lớp 5
      {
        id: 'g5_r4_q1',
        question: 'Hành tinh khổng lồ nào có diện tích bề mặt và khối lượng to lớn nhất trong hệ mặt trời?',
        answers: ['Mộc tinh (Jupiter)', 'Thổ Tinh có vành đai', 'Trái Đất xinh đẹp', 'Kim Tinh sáng chói'],
        correct: 0,
        exp: 30,
        gold: 24,
        hint: 'Hành tinh khí khổng lồ được mệnh danh là Thiên vương ngự trị trung tâm ngoài xa.'
      },
      {
        id: 'g5_r4_q2',
        question: 'Nhà vật lý học thiên tài nào gắn liền truyền thuyết quả táo rơi trúng đầu để từ đó nghiên cứu Thuyết Vạn Vật Hấp Dẫn?',
        answers: ['Albert Einstein', 'Isaac Newton', 'Galileo Galilei', 'Thomas Edison'],
        correct: 1,
        exp: 30,
        gold: 24,
        hint: 'Vị khoa học gia lỗi lạc đặt nền móng giải thích lực hút bí ẩn kéo giữ trăng sao vũ trụ.'
      },
      {
        id: 'g5_r4_q3',
        question: 'Nguồn điện sinh hoạt trong gia đình Việt Nam chúng ta dùng chủ yếu có hiệu điện thế tiêu chuẩn là bao nhiêu?',
        answers: ['Hiệu điện thế 110 V', 'Hiệu điện thế 220 V', 'Hiệu điện thế 380 V', 'Hiệu điện thế 5 V sạc nhanh'],
        correct: 1,
        exp: 30,
        gold: 24,
        hint: 'Hiệu điện thế danh định xoay chiều ổn định chung của mạng điện gia dụng Việt Nam.'
      }
    ],
    region_5: [ // Đảo Rồng MOS - Lớp 5
      {
        id: 'g5_r5_q1',
        question: 'Trong Microsoft Excel nâng cao, hàm tìm kiếm tham chiếu dữ liệu dựa vào cột dọc phổ biến nhất là hàm nào?',
        answers: ['Hàm HLOOKUP', 'Hàm VLOOKUP', 'Hàm INDEX-MATCH', 'Hàm IF'],
        correct: 1,
        exp: 30,
        gold: 24,
        hint: 'Hàm lấy tiền tố V viết tắt của Vertical (dọc).'
      },
      {
        id: 'g5_r5_q2',
        question: 'Để căn đều thẳng hàng hai bên tài lề cho đoạn văn bản Word thêm sang trọng học thuật, em dùng tổ hợp phím tắt gì?',
        answers: ['Ctrl + J', 'Ctrl + E', 'Ctrl + L', 'Ctrl + R'],
        correct: 0,
        exp: 30,
        gold: 24,
        hint: '"J" viết tắt của "Justify" nghĩa là căn đỉnh lề đều thẳng băng.'
      },
      {
        id: 'g5_r5_q3',
        question: 'Trong excel công sở nâng cao, để đếm số ô chứa dữ liệu mốc chỉ số tự nhiên nhanh nhất dũng sỹ dùng hàm nào?',
        answers: ['Hàm COUNT', 'Hàm COUNTA', 'Hàm SUM', 'Hàm MAX'],
        correct: 0,
        exp: 30,
        gold: 24,
        hint: 'COUNT là hàm đếm số, còn COUNTA đếm tất cả các ô có chữ lẫn số.'
      }
    ],
    region_6: [ // Vương Quốc AI - Lớp 5
      {
        id: 'g5_r6_q1',
        question: 'Trong lập trình ứng dụng Python, cấu trúc lưu trữ tập hợp danh sách các phần tử theo thứ tự bao quanh bởi dấu ngoặc vuông `[ ]` được gọi là gì?',
        answers: ['Dạng mảng văn bản array', 'Dạng Danh sách (List)', 'Dạng Từ điển (Dictionary)', 'Dạng tuple cố định'],
        correct: 1,
        exp: 30,
        gold: 24,
        hint: 'Cấp kiểu lưu trữ List linh hoạt, cho phép thêm bớt item tùy thích.'
      },
      {
        id: 'g5_r6_q2',
        question: 'Đâu là một hành xử văn minh chuẩn mực của dũng sỹ kỷ nguyên số khi khai thác AI hỗ trợ làm bài?',
        answers: [
          'Dùng AI để dịch nghĩa và giải thích bước giải từ khó, lắng nghe gợi ý rồi tự mình rèn luyện tư duy thực hành',
          'Coi AI là người học thay, copy sạch kết quả vào bài tập nộp cho giống thầy cô',
          'Nghịch phá AI tạo ra các bức ảnh bêu rếu chế giễu bạn bè',
          'Tải mã độc virus đính kèm qua AI thử nghiệm'
        ],
        correct: 0,
        exp: 30,
        gold: 24,
        hint: 'AI là trợ thủ nâng cánh tri thức, không thể thay thế cho tiến trình tự hào tự tay giải bài của em.'
      },
      {
        id: 'g5_r6_q3',
        question: 'Trong ngôn ngữ lập trình Python thịnh hành, để chèn thêm một dòng ghi chú bình luận giải nghĩa (máy bỏ qua), dũng sĩ mở đầu bằng?',
        answers: ['Ký tự dải thăng #', 'Cặp ký tự gạch chéo //', 'Dấu chấm phẩy ;', 'Dấu ngoặc kép song hành'],
        correct: 0,
        exp: 30,
        gold: 24,
        hint: 'Sử dụng ký tự hashtag thăng # để vô hiệu hóa dòng phân tích tự do.'
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
