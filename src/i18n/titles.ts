import type { Locale } from './locales';

type NonEn = Exclude<Locale, 'en'>;
type Names = Record<NonEn, string>;

const CATEGORY_EN: Record<string, string> = {
  'fruit-powder': 'Fruit Powder',
  'fruit-powder/freeze-dried-fruit-powder': 'Freeze Dried Fruit Powder',
  'vegetable-powder': 'Vegetable Powder',
  'plant-based-protein': 'Plant-based Protein',
  'instant-tea-powder': 'Instant tea powder',
  'greens-powder': 'Greens Powder',
  'dried-fruit': 'Dried Fruit',
  'dried-vegetables': 'Dried Vegetables',
  'adaptogens-powder': 'Adaptogens Powder',
};

const CATEGORY: Record<string, Names> = {
  'fruit-powder': {
    zh: '果粉', 'zh-tw': '果粉', es: 'Polvo de fruta', pt: 'Pó de fruta', fr: 'Poudre de fruit', de: 'Fruchtpulver', it: 'Polvere di frutta', ru: 'Фруктовый порошок', ja: 'フルーツパウダー', ko: '과일 분말', ar: 'مسحوق الفواكه', id: 'Bubuk buah', vi: 'Bột trái cây',
  },
  'fruit-powder/freeze-dried-fruit-powder': {
    zh: '冻干果粉', 'zh-tw': '凍乾果粉', es: 'Polvo de fruta liofilizado', pt: 'Pó de fruta liofilizado', fr: 'Poudre de fruit lyophilisée', de: 'Gefriergetrocknetes Fruchtpulver', it: 'Polvere di frutta liofilizzata', ru: 'Сублимированный фруктовый порошок', ja: 'フリーズドライフルーツパウダー', ko: '동결건조 과일 분말', ar: 'مسحوق فواكه مجفف بالتجميد', id: 'Bubuk buah beku-kering', vi: 'Bột trái cây sấy thăng hoa',
  },
  'vegetable-powder': {
    zh: '蔬菜粉', 'zh-tw': '蔬菜粉', es: 'Polvo de verdura', pt: 'Pó de vegetal', fr: 'Poudre de légume', de: 'Gemüsepulver', it: 'Polvere di verdura', ru: 'Овощной порошок', ja: '野菜パウダー', ko: '채소 분말', ar: 'مسحوق الخضار', id: 'Bubuk sayur', vi: 'Bột rau củ',
  },
  'plant-based-protein': {
    zh: '植物蛋白', 'zh-tw': '植物蛋白', es: 'Proteína vegetal', pt: 'Proteína vegetal', fr: 'Protéine végétale', de: 'Pflanzliches Protein', it: 'Proteina vegetale', ru: 'Растительный белок', ja: '植物性プロテイン', ko: '식물성 단백질', ar: 'بروتين نباتي', id: 'Protein nabati', vi: 'Protein thực vật',
  },
  'instant-tea-powder': {
    zh: '速溶茶粉', 'zh-tw': '速溶茶粉', es: 'Polvo de té instantáneo', pt: 'Pó de chá instantâneo', fr: 'Poudre de thé instantané', de: 'Instant-Teepulver', it: 'Polvere di tè istantaneo', ru: 'Растворимый чайный порошок', ja: 'インスタントティーパウダー', ko: '인스턴트 차 분말', ar: 'مسحوق شاي فوري', id: 'Bubuk teh instan', vi: 'Bột trà hòa tan',
  },
  'greens-powder': {
    zh: '青汁粉', 'zh-tw': '青汁粉', es: 'Polvo verde', pt: 'Pó verde', fr: 'Poudre verte', de: 'Grünpulver', it: 'Polvere verde', ru: 'Порошок зелени', ja: '青汁パウダー', ko: '그린 분말', ar: 'مسحوق الخضرة', id: 'Bubuk sayuran hijau', vi: 'Bột rau xanh',
  },
  'dried-fruit': {
    zh: '果干', 'zh-tw': '果乾', es: 'Fruta seca', pt: 'Fruta seca', fr: 'Fruit séché', de: 'Trockenfrucht', it: 'Frutta essiccata', ru: 'Сухофрукты', ja: 'ドライフルーツ', ko: '건과일', ar: 'فاكهة مجففة', id: 'Buah kering', vi: 'Trái cây sấy',
  },
  'dried-vegetables': {
    zh: '蔬菜干', 'zh-tw': '蔬菜乾', es: 'Verdura seca', pt: 'Vegetal seco', fr: 'Légume séché', de: 'Trockengemüse', it: 'Verdura essiccata', ru: 'Сушеные овощи', ja: '乾燥野菜', ko: '건채소', ar: 'خضار مجففة', id: 'Sayur kering', vi: 'Rau củ sấy',
  },
  'adaptogens-powder': {
    zh: '适应原粉', 'zh-tw': '適應原粉', es: 'Polvo de adaptógenos', pt: 'Pó de adaptógenos', fr: 'Poudre d’adaptogènes', de: 'Adaptogenpulver', it: 'Polvere di adattogeni', ru: 'Порошок адаптогенов', ja: 'アダプトゲンパウダー', ko: '아답토겐 분말', ar: 'مسحوق المتكيفات', id: 'Bubuk adaptogen', vi: 'Bột adaptogen',
  },
};

const TAG: Record<string, Names> = {
  'spray-dried-fruit-powder': {
    zh: '喷雾干燥果粉', 'zh-tw': '噴霧乾燥果粉', es: 'Polvo de fruta secado por aspersión', pt: 'Pó de fruta atomizado', fr: 'Poudre de fruit atomisée', de: 'Sprühgetrocknetes Fruchtpulver', it: 'Polvere di frutta atomizzata', ru: 'Фруктовый порошок распылительной сушки', ja: 'スプレードライフルーツパウダー', ko: '분무건조 과일 분말', ar: 'مسحوق فاكهة مجفف بالرش', id: 'Bubuk buah spray-dried', vi: 'Bột trái cây sấy phun',
  },
};

function names(
  zh: string, tw: string, es: string, pt: string, fr: string, de: string, it: string, ru: string, ja: string, ko: string, ar: string, id: string, vi: string,
): Names {
  return { zh, 'zh-tw': tw, es, pt, fr, de, it, ru, ja, ko, ar, id, vi };
}

const PRODUCT_TITLES: Record<string, Names> = {
  'banana-powder': names('香蕉粉', '香蕉粉', 'Polvo de plátano', 'Pó de banana', 'Poudre de banane', 'Bananenpulver', 'Polvere di banana', 'Банановый порошок', 'バナナパウダー', '바나나 분말', 'مسحوق الموز', 'Bubuk pisang', 'Bột chuối'),
  'jasmine-tea-powder': names('茉莉花茶粉', '茉莉花茶粉', 'Polvo de té de jazmín', 'Pó de chá de jasmim', 'Poudre de thé au jasmin', 'Jasminteepulver', 'Polvere di tè al gelsomino', 'Порошок жасминового чая', 'ジャスミンティーパウダー', '자스민 차 분말', 'مسحوق شاي الياسمين', 'Bubuk teh melati', 'Bột trà lài'),
  'lime-powder': names('青柠粉', '青檸粉', 'Polvo de lima', 'Pó de limão-taiti', 'Poudre de citron vert', 'Limettenpulver', 'Polvere di lime', 'Порошок лайма', 'ライムパウダー', '라임 분말', 'مسحوق الليم', 'Bubuk jeruk nipis', 'Bột chanh ta'),
  'blueberry-juice-powder': names('蓝莓汁粉', '藍莓汁粉', 'Polvo de jugo de arándano', 'Pó de suco de mirtilo', 'Poudre de jus de myrtille', 'Heidelbeersaftpulver', 'Polvere di succo di mirtillo', 'Порошок черничного сока', 'ブルーベリージュースパウダー', '블루베리 주스 분말', 'مسحوق عصير التوت الأزرق', 'Bubuk jus blueberry', 'Bột nước việt quất'),
  'wheat-protein-powder': names('小麦蛋白粉', '小麥蛋白粉', 'Proteína de trigo en polvo', 'Proteína de trigo em pó', 'Protéine de blé en poudre', 'Weizenproteinpulver', 'Proteina di frumento in polvere', 'Пшеничный белок', '小麦プロテイン', '밀 단백질 분말', 'مسحوق بروتين القمح', 'Bubuk protein gandum', 'Bột protein lúa mì'),
  'blackcurrant-powder': names('黑加仑粉', '黑加侖粉', 'Polvo de grosella negra', 'Pó de cassis', 'Poudre de cassis', 'Schwarze-Johannisbeer-Pulver', 'Polvere di ribes nero', 'Порошок черной смородины', 'カシスパウダー', '블랙커런트 분말', 'مسحوق الكشمش الأسود', 'Bubuk blackcurrant', 'Bột lý chua đen'),
  'avocado-seed-powder': names('牛油果籽粉', '酪梨籽粉', 'Polvo de semilla de aguacate', 'Pó de semente de abacate', 'Poudre de graine d’avocat', 'Avocadokernpulver', 'Polvere di seme di avocado', 'Порошок косточки авокадо', 'アボカドシードパウダー', '아보카도 씨 분말', 'مسحوق بذور الأفوكادو', 'Bubuk biji alpukat', 'Bột hạt bơ'),
  'freeze-dried-dragon-fruit-powder': names('冻干火龙果粉', '凍乾火龍果粉', 'Polvo liofilizado de pitaya', 'Pó liofilizado de pitaya', 'Poudre de pitaya lyophilisée', 'Gefriergetrocknetes Drachenfruchtpulver', 'Polvere di pitaya liofilizzata', 'Сублимированный порошок питахайи', 'フリーズドライドラゴンフルーツ', '동결건조 용과 분말', 'مسحوق فاكهة التنين المجفف بالتجميد', 'Bubuk buah naga beku-kering', 'Bột thanh long sấy thăng hoa'),
  'freeze-dried-blueberry-powder': names('冻干蓝莓粉', '凍乾藍莓粉', 'Polvo liofilizado de arándano', 'Pó liofilizado de mirtilo', 'Poudre de myrtille lyophilisée', 'Gefriergetrocknetes Heidelbeerpulver', 'Polvere di mirtillo liofilizzato', 'Сублимированный черничный порошок', 'フリーズドライブルーベリー', '동결건조 블루베리 분말', 'مسحوق توت أزرق مجفف بالتجميد', 'Bubuk blueberry beku-kering', 'Bột việt quất sấy thăng hoa'),
  'freeze-dried-lemon-powder': names('冻干柠檬粉', '凍乾檸檬粉', 'Polvo liofilizado de limón', 'Pó liofilizado de limão', 'Poudre de citron lyophilisée', 'Gefriergetrocknetes Zitronenpulver', 'Polvere di limone liofilizzato', 'Сублимированный лимонный порошок', 'フリーズドライレモン', '동결건조 레몬 분말', 'مسحوق ليمون مجفف بالتجميد', 'Bubuk lemon beku-kering', 'Bột chanh sấy thăng hoa'),
  'freeze-dried-coconut-water-powder': names('冻干椰子水粉', '凍乾椰子水粉', 'Polvo liofilizado de agua de coco', 'Pó liofilizado de água de coco', 'Poudre d’eau de coco lyophilisée', 'Gefriergetrocknetes Kokoswasserpulver', 'Polvere di acqua di cocco liofilizzata', 'Сублимированный порошок кокосовой воды', 'フリーズドライココナッツウォーター', '동결건조 코코넛워터 분말', 'مسحوق ماء جوز الهند المجفف بالتجميد', 'Bubuk air kelapa beku-kering', 'Bột nước dừa sấy thăng hoa'),
  'freeze-dried-banana-powder': names('冻干香蕉粉', '凍乾香蕉粉', 'Polvo liofilizado de plátano', 'Pó liofilizado de banana', 'Poudre de banane lyophilisée', 'Gefriergetrocknetes Bananenpulver', 'Polvere di banana liofilizzata', 'Сублимированный банановый порошок', 'フリーズドライバナナ', '동결건조 바나나 분말', 'مسحوق موز مجفف بالتجميد', 'Bubuk pisang beku-kering', 'Bột chuối sấy thăng hoa'),
  'garlic-powder': names('大蒜粉', '大蒜粉', 'Polvo de ajo', 'Pó de alho', 'Poudre d’ail', 'Knoblauchpulver', 'Polvere di aglio', 'Чесночный порошок', 'ガーリックパウダー', '마늘 분말', 'مسحوق الثوم', 'Bubuk bawang putih', 'Bột tỏi'),
  'freeze-dried-strawberry-powder': names('冻干草莓粉', '凍乾草莓粉', 'Polvo liofilizado de fresa', 'Pó liofilizado de morango', 'Poudre de fraise lyophilisée', 'Gefriergetrocknetes Erdbeerpulver', 'Polvere di fragola liofilizzata', 'Сублимированный клубничный порошок', 'フリーズドライストロベリー', '동결건조 딸기 분말', 'مسحوق فراولة مجفف بالتجميد', 'Bubuk stroberi beku-kering', 'Bột dâu tây sấy thăng hoa'),
  'guava-powder': names('番石榴粉', '番石榴粉', 'Polvo de guayaba', 'Pó de goiaba', 'Poudre de goyave', 'Guavenpulver', 'Polvere di guava', 'Порошок гуавы', 'グアバパウダー', '구아바 분말', 'مسحوق الجوافة', 'Bubuk jambu biji', 'Bột ổi'),
  'peach-powder': names('水蜜桃粉', '水蜜桃粉', 'Polvo de melocotón', 'Pó de pêssego', 'Poudre de pêche', 'Pfirsichpulver', 'Polvere di pesca', 'Персиковый порошок', 'ピーチパウダー', '복숭아 분말', 'مسحوق الخوخ', 'Bubuk persik', 'Bột đào'),
  'blackberry-powder': names('黑莓粉', '黑莓粉', 'Polvo de mora', 'Pó de amora-preta', 'Poudre de mûre', 'Brombeerpulver', 'Polvere di mora', 'Ежевичный порошок', 'ブラックベリーパウダー', '블랙베리 분말', 'مسحوق التوت الأسود', 'Bubuk blackberry', 'Bột mâm xôi đen'),
  'bilberry-powder': names('越橘粉', '越橘粉', 'Polvo de arándano europeo', 'Pó de mirtilo-bilberry', 'Poudre de myrtille', 'Heidelbeerpulver', 'Polvere di mirtillo', 'Порошок черники', 'ビルベリーパウダー', '빌베리 분말', 'مسحوق التوت البري الأوروبي', 'Bubuk bilberry', 'Bột bilberry'),
  'apple-powder': names('苹果粉', '蘋果粉', 'Polvo de manzana', 'Pó de maçã', 'Poudre de pomme', 'Apfelpulver', 'Polvere di mela', 'Яблочный порошок', 'アップルパウダー', '사과 분말', 'مسحوق التفاح', 'Bubuk apel', 'Bột táo'),
  'purple-sweet-potato-powder': names('紫薯粉', '紫薯粉', 'Polvo de batata morada', 'Pó de batata-doce roxa', 'Poudre de patate douce violette', 'Lila-Süßkartoffelpulver', 'Polvere di patata dolce viola', 'Порошок фиолетового батата', '紫芋パウダー', '자색고구마 분말', 'مسحوق البطاطا الحلوة البنفسجية', 'Bubuk ubi ungu', 'Bột khoai lang tím'),
  'yam-powder': names('山药粉', '山藥粉', 'Polvo de ñame', 'Pó de inhame', 'Poudre d’igname', 'Yampulver', 'Polvere di igname', 'Порошок ямса', 'ヤムパウダー', '마 분말', 'مسحوق اليام', 'Bubuk ubi', 'Bột củ mài'),
  'bitter-gourd-powder': names('苦瓜粉', '苦瓜粉', 'Polvo de melón amargo', 'Pó de melão-de-são-caetano', 'Poudre de margose', 'Bittermelonenpulver', 'Polvere di momordica', 'Порошок горькой дыни', 'ゴーヤパウダー', '여주 분말', 'مسحوق القرع المر', 'Bubuk pare', 'Bột khổ qua'),
  'carrot-powder': names('胡萝卜粉', '胡蘿蔔粉', 'Polvo de zanahoria', 'Pó de cenoura', 'Poudre de carotte', 'Karottenpulver', 'Polvere di carota', 'Морковный порошок', 'キャロットパウダー', '당근 분말', 'مسحوق الجزر', 'Bubuk wortel', 'Bột cà rốt'),
  'mango-powder': names('芒果粉', '芒果粉', 'Polvo de mango', 'Pó de manga', 'Poudre de mangue', 'Mangopulver', 'Polvere di mango', 'Манговый порошок', 'マンゴーパウダー', '망고 분말', 'مسحوق المانجو', 'Bubuk mangga', 'Bột xoài'),
  'onion-powder': names('洋葱粉', '洋蔥粉', 'Polvo de cebolla', 'Pó de cebola', 'Poudre d’oignon', 'Zwiebelpulver', 'Polvere di cipolla', 'Луковый порошок', 'オニオンパウダー', '양파 분말', 'مسحوق البصل', 'Bubuk bawang bombay', 'Bột hành tây'),
  'beet-juice-powder': names('甜菜汁粉', '甜菜汁粉', 'Polvo de jugo de remolacha', 'Pó de suco de beterraba', 'Poudre de jus de betterave', 'Rote-Bete-Saftpulver', 'Polvere di succo di barbabietola', 'Порошок свекольного сока', 'ビーツジュースパウダー', '비트 주스 분말', 'مسحوق عصير الشمندر', 'Bubuk jus bit', 'Bột nước củ dền'),
  'hydrolyzed-wheat-protein': names('水解小麦蛋白', '水解小麥蛋白', 'Proteína de trigo hidrolizada', 'Proteína de trigo hidrolisada', 'Protéine de blé hydrolysée', 'Hydrolysiertes Weizenprotein', 'Proteina di frumento idrolizzata', 'Гидролизованный пшеничный белок', '加水分解小麦プロテイン', '가수분해 밀 단백질', 'بروتين قمح متحلل', 'Protein gandum terhidrolisis', 'Protein lúa mì thủy phân'),
  'acai-berry-powder': names('阿萨伊果粉', '阿薩伊果粉', 'Polvo de açai', 'Pó de açaí', 'Poudre d’açaï', 'Acai-Pulver', 'Polvere di açai', 'Порошок асаи', 'アサイーパウダー', '아사이 분말', 'مسحوق الآساي', 'Bubuk acai', 'Bột acai'),
  'bulk-turmeric-powder': names('姜黄粉', '薑黃粉', 'Polvo de cúrcuma', 'Pó de cúrcuma', 'Poudre de curcuma', 'Kurkumapulver', 'Polvere di curcuma', 'Порошок куркумы', 'ターメリックパウダー', '강황 분말', 'مسحوق الكركم', 'Bubuk kunyit', 'Bột nghệ'),
  'grapefruit-powder': names('葡萄柚粉', '葡萄柚粉', 'Polvo de pomelo', 'Pó de toranja', 'Poudre de pamplemousse', 'Grapefruitpulver', 'Polvere di pompelmo', 'Порошок грейпфрута', 'グレープフルーツパウダー', '자몽 분말', 'مسحوق الجريب فروت', 'Bubuk jeruk bali', 'Bột bưởi'),
  'lemon-juice-powder': names('柠檬汁粉', '檸檬汁粉', 'Polvo de jugo de limón', 'Pó de suco de limão', 'Poudre de jus de citron', 'Zitronensaftpulver', 'Polvere di succo di limone', 'Порошок лимонного сока', 'レモンジュースパウダー', '레몬 주스 분말', 'مسحوق عصير الليمون', 'Bubuk jus lemon', 'Bột nước chanh'),
  'celery-powder': names('芹菜粉', '芹菜粉', 'Polvo de apio', 'Pó de aipo', 'Poudre de céleri', 'Selleriepulver', 'Polvere di sedano', 'Порошок сельдерея', 'セロリパウダー', '셀러리 분말', 'مسحوق الكرفس', 'Bubuk seledri', 'Bột cần tây'),
  'lemon-powder': names('柠檬粉', '檸檬粉', 'Polvo de limón', 'Pó de limão', 'Poudre de citron', 'Zitronenpulver', 'Polvere di limone', 'Лимонный порошок', 'レモンパウダー', '레몬 분말', 'مسحوق الليمون', 'Bubuk lemon', 'Bột chanh'),
  'pear-powder': names('梨粉', '梨粉', 'Polvo de pera', 'Pó de pera', 'Poudre de poire', 'Birnenpulver', 'Polvere di pera', 'Грушевый порошок', 'ペアパウダー', '배 분말', 'مسحوق الكمثرى', 'Bubuk pir', 'Bột lê'),
  'prunes-powder': names('西梅粉', '西梅粉', 'Polvo de ciruela pasa', 'Pó de ameixa seca', 'Poudre de pruneau', 'Backpflaumenpulver', 'Polvere di prugna secca', 'Порошок чернослива', 'プルーンパウダー', '프룬 분말', 'مسحوق البرقوق المجفف', 'Bubuk prune', 'Bột mận khô'),
  'ginger-powder': names('生姜粉', '生薑粉', 'Polvo de jengibre', 'Pó de gengibre', 'Poudre de gingembre', 'Ingwerpulver', 'Polvere di zenzero', 'Имбирный порошок', 'ジンジャーパウダー', '생강 분말', 'مسحوق الزنجبيل', 'Bubuk jahe', 'Bột gừng'),
  'barley-grass-juice-powder': names('大麦苗汁粉', '大麥苗汁粉', 'Polvo de jugo de hierba de cebada', 'Pó de suco de grama de cevada', 'Poudre de jus d’herbe d’orge', 'Gerstengrassaftpulver', 'Polvere di succo di erba d’orzo', 'Порошок сока ячменной травы', '大麦若葉ジュースパウダー', '보리새싹즙 분말', 'مسحوق عصير عشب الشعير', 'Bubuk jus rumput jelai', 'Bột nước cỏ lúa mạch'),
  'broccoli-powder': names('西兰花粉', '西藍花粉', 'Polvo de brócoli', 'Pó de brócolis', 'Poudre de brocoli', 'Brokkolipulver', 'Polvere di broccolo', 'Порошок брокколи', 'ブロッコリーパウダー', '브로콜리 분말', 'مسحوق البروكلي', 'Bubuk brokoli', 'Bột bông cải xanh'),
  'kale-powder': names('羽衣甘蓝粉', '羽衣甘藍粉', 'Polvo de kale', 'Pó de couve', 'Poudre de chou kale', 'Grünkohlpulver', 'Polvere di cavolo riccio', 'Порошок капусты кале', 'ケールパウダー', '케일 분말', 'مسحوق الكرنب الأجعد', 'Bubuk kailan', 'Bột cải xoăn'),
  'spinach-powder': names('菠菜粉', '菠菜粉', 'Polvo de espinaca', 'Pó de espinafre', 'Poudre d’épinard', 'Spinatpulver', 'Polvere di spinaci', 'Порошок шпината', 'ほうれん草パウダー', '시금치 분말', 'مسحوق السبانخ', 'Bubuk bayam', 'Bột rau chân vịt'),
  'chlorella-powder': names('小球藻粉', '小球藻粉', 'Polvo de chlorella', 'Pó de chlorella', 'Poudre de chlorelle', 'Chlorellapulver', 'Polvere di clorella', 'Порошок хлореллы', 'クロレラパウダー', '클로렐라 분말', 'مسحوق الكلوريلا', 'Bubuk chlorella', 'Bột chlorella'),
  'quinoa-protein-powder': names('藜麦蛋白粉', '藜麥蛋白粉', 'Proteína de quinua en polvo', 'Proteína de quinoa em pó', 'Protéine de quinoa en poudre', 'Quinoaproteinpulver', 'Proteina di quinoa in polvere', 'Белок киноа', 'キヌアプロテイン', '퀴노아 단백질 분말', 'مسحوق بروتين الكينوا', 'Bubuk protein quinoa', 'Bột protein diêm mạch'),
  'apple-vinegar-powder': names('苹果醋粉', '蘋果醋粉', 'Polvo de vinagre de manzana', 'Pó de vinagre de maçã', 'Poudre de vinaigre de cidre', 'Apfelessigpulver', 'Polvere di aceto di mele', 'Порошок яблочного уксуса', 'リンゴ酢パウダー', '사과식초 분말', 'مسحوق خل التفاح', 'Bubuk cuka apel', 'Bột giấm táo'),
  'lions-mane-powder': names('猴头菇粉', '猴頭菇粉', 'Polvo de melena de león', 'Pó de juba-de-leão', 'Poudre d’hydne hérisson', 'Löwenmähnenpulver', 'Polvere di criniera di leone', 'Порошок ежовика гребенчатого', 'ヤマブシタケパウダー', '사자갈기버섯 분말', 'مسحوق عرف الأسد', 'Bubuk lion’s mane', 'Bột nấm hầu thủ'),
  'dragon-fruit-powder': names('火龙果粉', '火龍果粉', 'Polvo de pitaya', 'Pó de pitaya', 'Poudre de pitaya', 'Drachenfruchtpulver', 'Polvere di pitaya', 'Порошок питахайи', 'ドラゴンフルーツパウダー', '용과 분말', 'مسحوق فاكهة التنين', 'Bubuk buah naga', 'Bột thanh long'),
  'pumpkin-seed-protein-powder': names('南瓜籽蛋白粉', '南瓜籽蛋白粉', 'Proteína de semilla de calabaza', 'Proteína de semente de abóbora', 'Protéine de graine de courge', 'Kürbiskernprotein', 'Proteina di semi di zucca', 'Белок тыквенных семечек', 'パンプキンシードプロテイン', '호박씨 단백질 분말', 'مسحوق بروتين بذور اليقطين', 'Bubuk protein biji labu', 'Bột protein hạt bí'),
  'apple-juice-powder': names('苹果汁粉', '蘋果汁粉', 'Polvo de jugo de manzana', 'Pó de suco de maçã', 'Poudre de jus de pomme', 'Apfelsaftpulver', 'Polvere di succo di mela', 'Порошок яблочного сока', 'アップルジュースパウダー', '사과 주스 분말', 'مسحوق عصير التفاح', 'Bubuk jus apel', 'Bột nước táo'),
  'applepectin-powder': names('苹果果胶粉', '蘋果果膠粉', 'Pectina de manzana en polvo', 'Pectina de maçã em pó', 'Pectine de pomme en poudre', 'Apfelpektinpulver', 'Pectina di mela in polvere', 'Яблочный пектин', 'アップルペクチン', '사과펙틴 분말', 'مسحوق بكتين التفاح', 'Bubuk pektin apel', 'Bột pectin táo'),
  'chia-seeds-protein-powder': names('奇亚籽蛋白粉', '奇亞籽蛋白粉', 'Proteína de chía en polvo', 'Proteína de chia em pó', 'Protéine de chia en poudre', 'Chiaproteinpulver', 'Proteina di chia in polvere', 'Белок семян чиа', 'チアシードプロテイン', '치아씨 단백질 분말', 'مسحوق بروتين بذور الشيا', 'Bubuk protein chia', 'Bột protein hạt chia'),
  'chickpea-protein-powder': names('鹰嘴豆蛋白粉', '鷹嘴豆蛋白粉', 'Proteína de garbanzo', 'Proteína de grão-de-bico', 'Protéine de pois chiche', 'Kichererbsenprotein', 'Proteina di ceci', 'Белок нута', 'ひよこ豆プロテイン', '병아리콩 단백질 분말', 'مسحوق بروتين الحمص', 'Bubuk protein kacang arab', 'Bột protein đậu gà'),
  'soy-protein-powder': names('大豆蛋白粉', '大豆蛋白粉', 'Proteína de soja en polvo', 'Proteína de soja em pó', 'Protéine de soja en poudre', 'Sojaproteinpulver', 'Proteina di soia in polvere', 'Соевый белок', 'ソイプロテイン', '대두 단백질 분말', 'مسحوق بروتين الصويا', 'Bubuk protein kedelai', 'Bột protein đậu nành'),
  'passion-fruit-powder': names('百香果粉', '百香果粉', 'Polvo de maracuyá', 'Pó de maracujá', 'Poudre de fruit de la passion', 'Passionsfruchtpulver', 'Polvere di frutto della passione', 'Порошок маракуйи', 'パッションフルーツパウダー', '패션프루트 분말', 'مسحوق فاكهة العاطفة', 'Bubuk markisa', 'Bột chanh dây'),
  'honeysuckle-powder': names('金银花粉', '金銀花粉', 'Polvo de madreselva', 'Pó de madressilva', 'Poudre de chèvrefeuille', 'Geißblattpulver', 'Polvere di caprifoglio', 'Порошок жимолости', 'スイカズラパウダー', '인동꽃 분말', 'مسحوق زهر العسل', 'Bubuk honeysuckle', 'Bột kim ngân'),
  'oat-protein-powder': names('燕麦蛋白粉', '燕麥蛋白粉', 'Proteína de avena', 'Proteína de aveia', 'Protéine d’avoine', 'Haferproteinpulver', 'Proteina d’avena', 'Овсяный белок', 'オーツプロテイン', '귀리 단백질 분말', 'مسحوق بروتين الشوفان', 'Bubuk protein oat', 'Bột protein yến mạch'),
  'potato-protein-powder': names('马铃薯蛋白粉', '馬鈴薯蛋白粉', 'Proteína de papa', 'Proteína de batata', 'Protéine de pomme de terre', 'Kartoffelprotein', 'Proteina di patata', 'Картофельный белок', 'ポテトプロテイン', '감자 단백질 분말', 'مسحوق بروتين البطاطس', 'Bubuk protein kentang', 'Bột protein khoai tây'),
  'mung-bean-protein-powder': names('绿豆蛋白粉', '綠豆蛋白粉', 'Proteína de frijol mungo', 'Proteína de feijão-mungo', 'Protéine de haricot mungo', 'Mungbohnenprotein', 'Proteina di fagiolo mungo', 'Белок маша', '緑豆プロテイン', '녹두 단백질 분말', 'مسحوق بروتين الماش', 'Bubuk protein kacang hijau', 'Bột protein đậu xanh'),
  'walnut-protein-powder': names('核桃蛋白粉', '核桃蛋白粉', 'Proteína de nuez', 'Proteína de noz', 'Protéine de noix', 'Walnussprotein', 'Proteina di noce', 'Белок грецкого ореха', 'クルミプロテイン', '호두 단백질 분말', 'مسحوق بروتين الجوز', 'Bubuk protein kenari', 'Bột protein óc chó'),
  'almond-protein-powder': names('杏仁蛋白粉', '杏仁蛋白粉', 'Proteína de almendra', 'Proteína de amêndoa', 'Protéine d’amande', 'Mandelprotein', 'Proteina di mandorla', 'Миндальный белок', 'アーモンドプロテイン', '아몬드 단백질 분말', 'مسحوق بروتين اللوز', 'Bubuk protein almond', 'Bột protein hạnh nhân'),
  'chrysanthemum-powder': names('菊花粉', '菊花粉', 'Polvo de crisantemo', 'Pó de crisântemo', 'Poudre de chrysanthème', 'Chrysanthemenpulver', 'Polvere di crisantemo', 'Порошок хризантемы', '菊花パウダー', '국화 분말', 'مسحوق الأقحوان', 'Bubuk krisan', 'Bột hoa cúc'),
  'dried-fruits-and-vegetables': names('果蔬干', '果蔬乾', 'Frutas y verduras secas', 'Frutas e vegetais secos', 'Fruits et légumes séchés', 'Getrocknetes Obst und Gemüse', 'Frutta e verdura essiccate', 'Сухофрукты и сушеные овощи', '乾燥フルーツと野菜', '건과일·건채소', 'فواكه وخضار مجففة', 'Buah dan sayur kering', 'Trái cây và rau củ sấy'),
  'dried-vegetable-chips': names('蔬菜脆片', '蔬菜脆片', 'Chips de verdura', 'Chips de vegetal', 'Chips de légumes', 'Gemüsechips', 'Chips di verdura', 'Овощные чипсы', '野菜チップ', '채소 칩', 'رقائق خضار', 'Keripik sayur', 'Rau củ sấy giòn'),
  'barley-grass-powder': names('大麦苗粉', '大麥苗粉', 'Polvo de hierba de cebada', 'Pó de grama de cevada', 'Poudre d’herbe d’orge', 'Gerstengraspulver', 'Polvere di erba d’orzo', 'Порошок ячменной травы', '大麦若葉パウダー', '보리새싹 분말', 'مسحوق عشب الشعير', 'Bubuk rumput jelai', 'Bột cỏ lúa mạch'),
  'oolong-tea-powder': names('乌龙茶粉', '烏龍茶粉', 'Polvo de té oolong', 'Pó de chá oolong', 'Poudre de thé oolong', 'Oolong-Teepulver', 'Polvere di tè oolong', 'Порошок чая улун', '烏龍茶パウダー', '우롱차 분말', 'مسحوق شاي الأولونغ', 'Bubuk teh oolong', 'Bột trà ô long'),
  'hibiscus-tea-powder': names('洛神花茶粉', '洛神花茶粉', 'Polvo de té de hibisco', 'Pó de chá de hibisco', 'Poudre de thé d’hibiscus', 'Hibiskustee-Pulver', 'Polvere di tè all’ibisco', 'Порошок чая каркаде', 'ハイビスカスティーパウダー', '히비스커스 차 분말', 'مسحوق شاي الكركديه', 'Bubuk teh rosela', 'Bột trà atiso đỏ'),
  'cherry-blossom-powder': names('樱花粉', '櫻花粉', 'Polvo de flor de cerezo', 'Pó de flor de cerejeira', 'Poudre de fleur de cerisier', 'Kirschblütenpulver', 'Polvere di fiore di ciliegio', 'Порошок сакуры', '桜パウダー', '벚꽃 분말', 'مسحوق زهر الكرز', 'Bubuk sakura', 'Bột hoa anh đào'),
  'rose-powder': names('玫瑰粉', '玫瑰粉', 'Polvo de rosa', 'Pó de rosa', 'Poudre de rose', 'Rosenpulver', 'Polvere di rosa', 'Порошок розы', 'ローズパウダー', '장미 분말', 'مسحوق الورد', 'Bubuk mawar', 'Bột hoa hồng'),
  'pineapple-powder': names('菠萝粉', '鳳梨粉', 'Polvo de piña', 'Pó de abacaxi', 'Poudre d’ananas', 'Ananaspulver', 'Polvere di ananas', 'Ананасовый порошок', 'パイナップルパウダー', '파인애플 분말', 'مسحوق الأناناس', 'Bubuk nanas', 'Bột dứa'),
  'dried-fruit-slice': names('水果干片', '水果乾片', 'Láminas de fruta seca', 'Fatias de fruta seca', 'Tranches de fruit séché', 'Getrocknete Fruchtscheiben', 'Fette di frutta essiccata', 'Сушеные фруктовые слайсы', 'ドライフルーツスライス', '건과일 슬라이스', 'شرائح فاكهة مجففة', 'Irisan buah kering', 'Lát trái cây sấy'),
  'olive-fruit-powder': names('橄榄果粉', '橄欖果粉', 'Polvo de aceituna', 'Pó de azeitona', 'Poudre d’olive', 'Olivenpulver', 'Polvere di oliva', 'Порошок оливы', 'オリーブパウダー', '올리브 분말', 'مسحوق الزيتون', 'Bubuk zaitun', 'Bột ô liu'),
  'peppermint-powder': names('薄荷粉', '薄荷粉', 'Polvo de menta', 'Pó de hortelã-pimenta', 'Poudre de menthe poivrée', 'Pfefferminzpulver', 'Polvere di menta piperita', 'Порошок мяты', 'ペパーミントパウダー', '페퍼민트 분말', 'مسحوق النعناع', 'Bubuk peppermint', 'Bột bạc hà'),
  'black-tea-powder': names('红茶粉', '紅茶粉', 'Polvo de té negro', 'Pó de chá preto', 'Poudre de thé noir', 'Schwarzteepulver', 'Polvere di tè nero', 'Порошок черного чая', '紅茶パウダー', '홍차 분말', 'مسحوق الشاي الأسود', 'Bubuk teh hitam', 'Bột trà đen'),
  'dried-fruit-chips': names('水果脆片', '水果脆片', 'Chips de fruta', 'Chips de fruta', 'Chips de fruit', 'Fruchtchips', 'Chips di frutta', 'Фруктовые чипсы', 'フルーツチップ', '과일 칩', 'رقائق فاكهة', 'Keripik buah', 'Trái cây sấy giòn'),
  'instant-green-tea-powder': names('速溶绿茶粉', '速溶綠茶粉', 'Polvo de té verde instantáneo', 'Pó de chá verde instantâneo', 'Poudre de thé vert instantané', 'Instant-Grünteepulver', 'Polvere di tè verde istantaneo', 'Растворимый зеленый чай', 'インスタント緑茶パウダー', '인스턴트 녹차 분말', 'مسحوق شاي أخضر فوري', 'Bubuk teh hijau instan', 'Bột trà xanh hòa tan'),
  'matcha-powder': names('抹茶粉', '抹茶粉', 'Polvo de matcha', 'Pó de matcha', 'Poudre de matcha', 'Matchapulver', 'Polvere di matcha', 'Порошок матча', '抹茶パウダー', '말차 분말', 'مسحوق الماتشا', 'Bubuk matcha', 'Bột matcha'),
  'avocado-powder': names('牛油果粉', '酪梨粉', 'Polvo de aguacate', 'Pó de abacate', 'Poudre d’avocat', 'Avocadopulver', 'Polvere di avocado', 'Порошок авокадо', 'アボカドパウダー', '아보카도 분말', 'مسحوق الأفوكادو', 'Bubuk alpukat', 'Bột bơ'),
  'noni-fruit-powder': names('诺丽果粉', '諾麗果粉', 'Polvo de noni', 'Pó de noni', 'Poudre de noni', 'Nonipulver', 'Polvere di noni', 'Порошок нони', 'ノニパウダー', '노니 분말', 'مسحوق النوني', 'Bubuk mengkudu', 'Bột nhàu'),
  'orange-powder': names('橙子粉', '柳橙粉', 'Polvo de naranja', 'Pó de laranja', 'Poudre d’orange', 'Orangenpulver', 'Polvere d’arancia', 'Апельсиновый порошок', 'オレンジパウダー', '오렌지 분말', 'مسحوق البرتقال', 'Bubuk jeruk', 'Bột cam'),
  'blueberry-powder': names('蓝莓粉', '藍莓粉', 'Polvo de arándano', 'Pó de mirtilo', 'Poudre de myrtille', 'Heidelbeerpulver', 'Polvere di mirtillo', 'Черничный порошок', 'ブルーベリーパウダー', '블루베리 분말', 'مسحوق التوت الأزرق', 'Bubuk blueberry', 'Bột việt quất'),
  'cranberry-powder': names('蔓越莓粉', '蔓越莓粉', 'Polvo de arándano rojo', 'Pó de cranberry', 'Poudre de canneberge', 'Cranberrypulver', 'Polvere di mirtillo rosso', 'Клюквенный порошок', 'クランベリーパウダー', '크랜베리 분말', 'مسحوق التوت البري', 'Bubuk cranberry', 'Bột nam việt quất'),
  'raspberry-powder': names('树莓粉', '覆盆子粉', 'Polvo de frambuesa', 'Pó de framboesa', 'Poudre de framboise', 'Himbeerpulver', 'Polvere di lampone', 'Малиновый порошок', 'ラズベリーパウダー', '라즈베리 분말', 'مسحوق التوت العليق', 'Bubuk raspberry', 'Bột mâm xôi'),
  'freeze-dried-peach-powder': names('冻干水蜜桃粉', '凍乾水蜜桃粉', 'Polvo liofilizado de melocotón', 'Pó liofilizado de pêssego', 'Poudre de pêche lyophilisée', 'Gefriergetrocknetes Pfirsichpulver', 'Polvere di pesca liofilizzata', 'Сублимированный персиковый порошок', 'フリーズドライピーチ', '동결건조 복숭아 분말', 'مسحوق خوخ مجفف بالتجميد', 'Bubuk persik beku-kering', 'Bột đào sấy thăng hoa'),
  'plum-powder': names('李子粉', '李子粉', 'Polvo de ciruela', 'Pó de ameixa', 'Poudre de prune', 'Pflaumenpulver', 'Polvere di prugna', 'Сливовый порошок', 'プラムパウダー', '자두 분말', 'مسحوق البرقوق', 'Bubuk plum', 'Bột mận'),
  'freeze-dried-raspberry-powder': names('冻干树莓粉', '凍乾覆盆子粉', 'Polvo liofilizado de frambuesa', 'Pó liofilizado de framboesa', 'Poudre de framboise lyophilisée', 'Gefriergetrocknetes Himbeerpulver', 'Polvere di lampone liofilizzato', 'Сублимированный малиновый порошок', 'フリーズドライラズベリー', '동결건조 라즈베리 분말', 'مسحوق توت العليق المجفف بالتجميد', 'Bubuk raspberry beku-kering', 'Bột mâm xôi sấy thăng hoa'),
  'strawberry-powder': names('草莓粉', '草莓粉', 'Polvo de fresa', 'Pó de morango', 'Poudre de fraise', 'Erdbeerpulver', 'Polvere di fragola', 'Клубничный порошок', 'ストロベリーパウダー', '딸기 분말', 'مسحوق الفراولة', 'Bubuk stroberi', 'Bột dâu tây'),
  'grape-powder': names('葡萄粉', '葡萄粉', 'Polvo de uva', 'Pó de uva', 'Poudre de raisin', 'Traubenpulver', 'Polvere d’uva', 'Виноградный порошок', 'グレープパウダー', '포도 분말', 'مسحوق العنب', 'Bubuk anggur', 'Bột nho'),
  'mulberry-powder': names('桑葚粉', '桑葚粉', 'Polvo de mora blanca', 'Pó de amora', 'Poudre de mûrier', 'Maulbeerpulver', 'Polvere di gelso', 'Порошок шелковицы', 'マルベリーパウダー', '오디 분말', 'مسحوق التوت', 'Bubuk murbei', 'Bột dâu tằm'),
  'pomegranate-juice-powder': names('石榴汁粉', '石榴汁粉', 'Polvo de jugo de granada', 'Pó de suco de romã', 'Poudre de jus de grenade', 'Granatapfelsaftpulver', 'Polvere di succo di melograno', 'Порошок гранатового сока', 'ザクロジュースパウダー', '석류 주스 분말', 'مسحوق عصير الرمان', 'Bubuk jus delima', 'Bột nước lựu'),
  'vanillin-powder': names('香兰素粉', '香蘭素粉', 'Polvo de vainillina', 'Pó de vanilina', 'Poudre de vanilline', 'Vanillinpulver', 'Polvere di vanillina', 'Ванилин', 'バニリンパウダー', '바닐린 분말', 'مسحوق الفانيلين', 'Bubuk vanilin', 'Bột vanillin'),
  'coconut-powder': names('椰子粉', '椰子粉', 'Polvo de coco', 'Pó de coco', 'Poudre de coco', 'Kokospulver', 'Polvere di cocco', 'Кокосовый порошок', 'ココナッツパウダー', '코코넛 분말', 'مسحوق جوز الهند', 'Bubuk kelapa', 'Bột dừa'),
  'acerola-cherry-powder': names('针叶樱桃粉', '西印度櫻桃粉', 'Polvo de acerola', 'Pó de acerola', 'Poudre d’acérola', 'Acerolapulver', 'Polvere di acerola', 'Порошок ацеролы', 'アセロラパウダー', '아세로라 분말', 'مسحوق الأسيرولا', 'Bubuk acerola', 'Bột sơ ri'),
  'shiitake-mushroom-powder': names('香菇粉', '香菇粉', 'Polvo de shiitake', 'Pó de shiitake', 'Poudre de shiitaké', 'Shiitakepulver', 'Polvere di shiitake', 'Порошок шиитаке', 'しいたけパウダー', '표고버섯 분말', 'مسحوق فطر الشيتاكي', 'Bubuk shiitake', 'Bột nấm hương'),
  'best-pea-protein-powder': names('豌豆蛋白粉', '豌豆蛋白粉', 'Proteína de guisante', 'Proteína de ervilha', 'Protéine de pois', 'Erbsenprotein', 'Proteina di pisello', 'Гороховый белок', 'エンドウプロテイン', '완두 단백질 분말', 'مسحوق بروتين البازلاء', 'Bubuk protein kacang polong', 'Bột protein đậu Hà Lan'),
  'pumpkin-powder': names('南瓜粉', '南瓜粉', 'Polvo de calabaza', 'Pó de abóbora', 'Poudre de citrouille', 'Kürbispulver', 'Polvere di zucca', 'Тыквенный порошок', 'パンプキンパウダー', '호박 분말', 'مسحوق اليقطين', 'Bubuk labu', 'Bột bí đỏ'),
  'guar-gum-powder': names('瓜尔胶粉', '瓜爾膠粉', 'Goma guar en polvo', 'Goma guar em pó', 'Gomme de guar en poudre', 'Guarkernmehl', 'Gomma di guar in polvere', 'Гуаровая камедь', 'グアーガム', '구아검 분말', 'مسحوق صمغ الغوار', 'Bubuk guar gum', 'Bột guar'),
  'tomato-powder': names('番茄粉', '番茄粉', 'Polvo de tomate', 'Pó de tomate', 'Poudre de tomate', 'Tomatenpulver', 'Polvere di pomodoro', 'Томатный порошок', 'トマトパウダー', '토마토 분말', 'مسحوق الطماطم', 'Bubuk tomat', 'Bột cà chua'),
};

export function categoryName(slug: string, locale: Locale): string {
  if (locale === 'en') return CATEGORY_EN[slug] || slug;
  return CATEGORY[slug]?.[locale] || CATEGORY_EN[slug] || slug;
}

export function tagName(slug: string, english: string, locale: Locale): string {
  if (locale === 'en') return english;
  return TAG[slug]?.[locale] || english;
}

export function productTitle(slug: string, english: string, locale: Locale): string {
  if (locale === 'en') return english;
  return PRODUCT_TITLES[slug]?.[locale] || english;
}
