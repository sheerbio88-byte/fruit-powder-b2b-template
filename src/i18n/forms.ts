import type { Disclaimer, Input, Textarea } from '~/types';
import type { Locale } from './locales';

type OptionRow = { value: string; en: string } & Partial<Record<Locale, string>>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const COMPANY: OptionRow[] = [
  { value: 'Company / Brand', en: 'Company / Brand', zh: '公司／品牌', es: 'Empresa / marca', pt: 'Empresa / marca', fr: 'Entreprise / marque', de: 'Unternehmen / Marke', it: 'Azienda / marchio', ru: 'Компания / бренд', ja: '会社／ブランド', 'zh-tw': '公司／品牌', ko: '회사 / 브랜드', vi: 'Công ty / thương hiệu', id: 'Perusahaan / merek', ar: 'شركة / علامة' },
  { value: 'Individual', en: 'Individual / Personal', zh: '个人', es: 'Particular', pt: 'Particular', fr: 'Particulier', de: 'Privatperson', it: 'Privato', ru: 'Частное лицо', ja: '個人', 'zh-tw': '個人', ko: '개인', vi: 'Cá nhân', id: 'Perorangan', ar: 'فرد' },
  { value: 'Supermarket / Retail chain', en: 'Supermarket / Retail chain', zh: '超市／连锁', es: 'Supermercado / cadena', pt: 'Supermercado / rede', fr: 'Supermarché / enseigne', de: 'Supermarkt / Kette', it: 'Supermercato / catena', ru: 'Супермаркет / сеть', ja: 'スーパー／チェーン', 'zh-tw': '超市／連鎖', ko: '슈퍼 / 체인', vi: 'Siêu thị / chuỗi', id: 'Supermarket / ritel', ar: 'سوبرماركت / سلسلة' },
  { value: 'Online store / Amazon seller', en: 'Online store / Amazon seller', zh: '网店／亚马逊卖家', es: 'Tienda online / Amazon', pt: 'Loja online / Amazon', fr: 'Boutique en ligne / Amazon', de: 'Onlineshop / Amazon', it: 'Negozio online / Amazon', ru: 'Интернет-магазин / Amazon', ja: 'ネットショップ／Amazon', 'zh-tw': '電商／Amazon', ko: '온라인 / Amazon', vi: 'Cửa hàng online / Amazon', id: 'Toko online / Amazon', ar: 'متجر إلكتروني / أمازون' },
  { value: 'Pharmacy / Retail', en: 'Pharmacy / Retail', zh: '药店／零售', es: 'Farmacia / retail', pt: 'Farmácia / varejo', fr: 'Pharmacie / retail', de: 'Apotheke / Retail', it: 'Farmacia / retail', ru: 'Аптека / розница', ja: '薬局／小売', 'zh-tw': '藥局／零售', ko: '약국 / 리테일', vi: 'Nhà thuốc / bán lẻ', id: 'Farmasi / ritel', ar: 'صيدلية / تجزئة' },
  { value: 'Food / beverage brand', en: 'Food / beverage brand', zh: '食品／饮料品牌', es: 'Marca de alimentos', pt: 'Marca de alimentos', fr: 'Marque alimentaire', de: 'Lebensmittelmarke', it: 'Marchio alimentare', ru: 'Пищевой бренд', ja: '食品ブランド', 'zh-tw': '食品品牌', ko: '식품 브랜드', vi: 'Thương hiệu thực phẩm', id: 'Merek makanan', ar: 'علامة غذائية' },
  { value: 'Distributor / Wholesaler', en: 'Distributor / Wholesaler', zh: '经销商／批发商', es: 'Distribuidor / mayorista', pt: 'Distribuidor / atacadista', fr: 'Distributeur / gros', de: 'Distributor / Großhändler', it: 'Distributore / grossista', ru: 'Дистрибьютор / опт', ja: '卸／ディストリビューター', 'zh-tw': '經銷／批發', ko: '유통 / 도매', vi: 'Nhà phân phối / sỉ', id: 'Distributor / grosir', ar: 'موزّع / تاجر جملة' },
  { value: 'Other', en: 'Other', zh: '其他', es: 'Otro', pt: 'Outro', fr: 'Autre', de: 'Sonstiges', it: 'Altro', ru: 'Другое', ja: 'その他', 'zh-tw': '其他', ko: '기타', vi: 'Khác', id: 'Lainnya', ar: 'أخرى' },
];

const CHANNEL: OptionRow[] = [
  { value: 'Sample order', en: 'Sample order', zh: '样品订单', es: 'Pedido de muestra', pt: 'Pedido de amostra', fr: 'Commande d’échantillon', de: 'Musterbestellung', it: 'Ordine campione', ru: 'Заказ образца', ja: 'サンプル注文', 'zh-tw': '樣品訂單', ko: '샘플 주문', vi: 'Đơn mẫu', id: 'Pesanan sampel', ar: 'طلب عينة' },
  { value: 'Wholesale catalog', en: 'Wholesale catalog / pricing', zh: '批发目录／价格', es: 'Catálogo / precio mayorista', pt: 'Catálogo / preço atacado', fr: 'Catalogue / tarif gros', de: 'Katalog / Großhandelspreis', it: 'Catalogo / prezzo ingrosso', ru: 'Каталог / оптовая цена', ja: '卸カタログ／価格', 'zh-tw': '批發目錄／價格', ko: '도매 카탈로그 / 가격', vi: 'Catalogue / giá sỉ', id: 'Katalog / harga grosir', ar: 'كتالوج / سعر الجملة' },
  { value: 'Custom OEM', en: 'Custom OEM / artwork', zh: 'OEM／定制', es: 'OEM a medida', pt: 'OEM sob medida', fr: 'OEM sur mesure', de: 'OEM nach Vorgabe', it: 'OEM su misura', ru: 'OEM по заданию', ja: 'OEM／仕様指定', 'zh-tw': 'OEM／客製', ko: 'OEM / 맞춤', vi: 'OEM theo yêu cầu', id: 'OEM sesuai permintaan', ar: 'تصنيع OEM حسب الطلب' },
  { value: 'Private label', en: 'Private label branding', zh: '自有品牌', es: 'Marca privada', pt: 'Marca própria', fr: 'Marque privée', de: 'Private Label', it: 'Private label', ru: 'Собственная марка', ja: 'プライベートラベル', 'zh-tw': '自有品牌', ko: '프라이빗 라벨', vi: 'Nhãn riêng', id: 'Private label', ar: 'علامة خاصة' },
];

const VOLUME: OptionRow[] = [
  { value: 'Sample only', en: 'Sample only', zh: '仅样品', es: 'Solo muestra', pt: 'Só amostra', fr: 'Échantillon seulement', de: 'Nur Muster', it: 'Solo campione', ru: 'Только образец', ja: 'サンプルのみ', 'zh-tw': '僅樣品', ko: '샘플만', vi: 'Chỉ mẫu', id: 'Hanya sampel', ar: 'عينة فقط' },
  { value: 'Under 100 kg', en: 'Under 100 kg', zh: '100 公斤以下', es: 'Menos de 100 kg', pt: 'Menos de 100 kg', fr: 'Moins de 100 kg', de: 'Unter 100 kg', it: 'Meno di 100 kg', ru: 'Менее 100 кг', ja: '100kg未満', 'zh-tw': '100 公斤以下', ko: '100kg 미만', vi: 'Dưới 100 kg', id: 'Di bawah 100 kg', ar: 'أقل من 100 كغ' },
  { value: '100–500 kg', en: '100–500 kg', zh: '100–500 公斤', es: '100–500 kg', pt: '100–500 kg', fr: '100–500 kg', de: '100–500 kg', it: '100–500 kg', ru: '100–500 кг', ja: '100–500kg', 'zh-tw': '100–500 公斤', ko: '100–500kg', vi: '100–500 kg', id: '100–500 kg', ar: '100–500 كغ' },
  { value: '500–1,000 kg', en: '500–1,000 kg', zh: '500–1,000 公斤', es: '500–1.000 kg', pt: '500–1.000 kg', fr: '500–1 000 kg', de: '500–1.000 kg', it: '500–1.000 kg', ru: '500–1 000 кг', ja: '500–1,000kg', 'zh-tw': '500–1,000 公斤', ko: '500–1,000kg', vi: '500–1.000 kg', id: '500–1.000 kg', ar: '500–1,000 كغ' },
  { value: '1,000 kg+', en: '1,000 kg+', zh: '1,000 公斤以上', es: '1.000 kg+', pt: '1.000 kg+', fr: '1 000 kg+', de: '1.000 kg+', it: '1.000 kg+', ru: '1 000 кг+', ja: '1,000kg以上', 'zh-tw': '1,000 公斤以上', ko: '1,000kg 이상', vi: '1.000 kg+', id: '1.000 kg+', ar: 'أكثر من 1,000 كغ' },
];

type Labels = {
  company: string;
  channel: string;
  volume: string;
  product: string;
  productPh: string;
  name: string;
  email: string;
  select: string;
  namePh: string;
  message: string;
  messagePh: string;
  disclaimer: string;
  button: string;
  description: string;
  waTitle: string;
  waSub: string;
  waBtn: string;
  waDesc: string;
  waDisc: string;
  close: string;
  preferChat: string;
};

const LABELS: Record<Locale, Labels> = {
  en: { company: 'I am a', channel: "I'm looking for", volume: 'Order quantity', product: 'Product', productPh: 'Ingredient and specification', name: 'Name', email: 'Email', select: 'Select…', namePh: 'Your name', message: 'Message', messagePh: 'Product, specification, packing, ship-to country…', disclaimer: 'I agree to be contacted by Sheer Superfood about this ingredient inquiry.', button: 'Send inquiry', description: 'Tell us the powder, specification, and volume you need.', waTitle: 'Chat on WhatsApp', waSub: 'Quick details first — we continue on WhatsApp.', waBtn: 'Continue to WhatsApp', waDesc: 'We save your inquiry, then open WhatsApp.', waDisc: 'You agree we may contact you about this inquiry by email or WhatsApp.', close: 'Close', preferChat: 'Prefer chat?' },
  zh: { company: '我是', channel: '我要', volume: '订购数量', product: '产品', productPh: '原料和规格', name: '姓名', email: '邮箱', select: '请选择…', namePh: '您的姓名', message: '留言', messagePh: '产品、规格、包装、收货国家…', disclaimer: '我同意 Sheer Superfood 就本次果蔬粉询盘与我联系。', button: '发送询盘', description: '请告诉我们所需粉剂、规格和数量。', waTitle: 'WhatsApp 沟通', waSub: '先填简要信息，随后在 WhatsApp 继续。', waBtn: '继续到 WhatsApp', waDesc: '我们先保存询盘，再打开 WhatsApp。', waDisc: '您同意我们通过邮件或 WhatsApp 就本次询盘与您联系。', close: '关闭', preferChat: '想用聊天？' },
  'zh-tw': { company: '我是', channel: '我要', volume: '訂購數量', product: '產品', productPh: '原料和規格', name: '姓名', email: 'Email', select: '請選擇…', namePh: '您的姓名', message: '訊息', messagePh: '產品、規格、包裝、收貨國家…', disclaimer: '我同意 Sheer Superfood 就本次果蔬粉詢盤與我聯絡。', button: '送出詢盤', description: '請告訴我們所需粉劑、規格和數量。', waTitle: '用 WhatsApp 聯絡', waSub: '先填簡要資料，隨後在 WhatsApp 繼續。', waBtn: '繼續到 WhatsApp', waDesc: '我們先儲存詢盤，再開啟 WhatsApp。', waDisc: '您同意我們以 Email 或 WhatsApp 就本次詢盤與您聯絡。', close: '關閉', preferChat: '想用聊天？' },
  es: { company: 'Soy', channel: 'Busco', volume: 'Cantidad', product: 'Producto', productPh: 'Ingrediente y especificación', name: 'Nombre', email: 'Email', select: 'Seleccionar…', namePh: 'Su nombre', message: 'Mensaje', messagePh: 'Producto, especificación, envase, país de destino…', disclaimer: 'Acepto que Sheer Superfood me contacte sobre esta consulta de ingredientes.', button: 'Enviar consulta', description: 'Indique el polvo, la especificación y el volumen.', waTitle: 'Chatear por WhatsApp', waSub: 'Unos datos primero; seguimos en WhatsApp.', waBtn: 'Continuar a WhatsApp', waDesc: 'Guardamos su consulta y luego abrimos WhatsApp.', waDisc: 'Acepta que le contactemos por esta consulta por email o WhatsApp.', close: 'Cerrar', preferChat: '¿Prefiere chat?' },
  pt: { company: 'Sou', channel: 'Procuro', volume: 'Quantidade', product: 'Produto', productPh: 'Ingrediente e especificação', name: 'Nome', email: 'E-mail', select: 'Selecionar…', namePh: 'Seu nome', message: 'Mensagem', messagePh: 'Produto, especificação, embalagem, país de destino…', disclaimer: 'Concordo que a Sheer Superfood me contacte sobre esta consulta de ingredientes.', button: 'Enviar consulta', description: 'Informe o pó, a especificação e o volume.', waTitle: 'Conversar no WhatsApp', waSub: 'Alguns dados primeiro; seguimos no WhatsApp.', waBtn: 'Continuar no WhatsApp', waDesc: 'Guardamos a consulta e abrimos o WhatsApp.', waDisc: 'Você concorda em ser contactado sobre esta consulta por e-mail ou WhatsApp.', close: 'Fechar', preferChat: 'Prefere chat?' },
  fr: { company: 'Je suis', channel: 'Je cherche', volume: 'Quantité', product: 'Produit', productPh: 'Ingrédient et spécification', name: 'Nom', email: 'E-mail', select: 'Choisir…', namePh: 'Votre nom', message: 'Message', messagePh: 'Produit, spécification, emballage, pays de destination…', disclaimer: 'J’accepte d’être contacté par Sheer Superfood au sujet de cette demande d’ingrédient.', button: 'Envoyer la demande', description: 'Indiquez la poudre, la spécification et le volume.', waTitle: 'Discuter sur WhatsApp', waSub: 'Quelques informations d’abord ; la suite se fait sur WhatsApp.', waBtn: 'Continuer vers WhatsApp', waDesc: 'Nous enregistrons la demande, puis ouvrons WhatsApp.', waDisc: 'Vous acceptez d’être contacté au sujet de cette demande par e-mail ou WhatsApp.', close: 'Fermer', preferChat: 'Préférez le chat ?' },
  de: { company: 'Ich bin', channel: 'Ich suche', volume: 'Menge', product: 'Produkt', productPh: 'Zutat und Spezifikation', name: 'Name', email: 'E-Mail', select: 'Wählen…', namePh: 'Ihr Name', message: 'Nachricht', messagePh: 'Produkt, Spezifikation, Verpackung, Zielland…', disclaimer: 'Ich stimme zu, dass Sheer Superfood mich zu dieser Zutatenanfrage kontaktiert.', button: 'Anfrage senden', description: 'Nennen Sie Pulver, Spezifikation und Menge.', waTitle: 'Per WhatsApp chatten', waSub: 'Kurzdaten zuerst; wir machen auf WhatsApp weiter.', waBtn: 'Weiter zu WhatsApp', waDesc: 'Wir speichern die Anfrage und öffnen WhatsApp.', waDisc: 'Sie stimmen zu, dass wir Sie zu dieser Anfrage per E-Mail oder WhatsApp kontaktieren.', close: 'Schließen', preferChat: 'Lieber chatten?' },
  it: { company: 'Sono', channel: 'Cerco', volume: 'Quantità', product: 'Prodotto', productPh: 'Ingrediente e specifica', name: 'Nome', email: 'Email', select: 'Seleziona…', namePh: 'Il suo nome', message: 'Messaggio', messagePh: 'Prodotto, specifica, confezione, paese di destinazione…', disclaimer: 'Accetto che Sheer Superfood mi contatti per questa richiesta di ingredienti.', button: 'Invia richiesta', description: 'Indichi la polvere, la specifica e il volume.', waTitle: 'Chat su WhatsApp', waSub: 'Prima pochi dati; poi continuiamo su WhatsApp.', waBtn: 'Continua su WhatsApp', waDesc: 'Salviamo la richiesta e apriamo WhatsApp.', waDisc: 'Accetta di essere contattato per questa richiesta via email o WhatsApp.', close: 'Chiudi', preferChat: 'Preferisce la chat?' },
  ru: { company: 'Я', channel: 'Мне нужно', volume: 'Количество', product: 'Продукт', productPh: 'Ингредиент и спецификация', name: 'Имя', email: 'Эл. почта', select: 'Выберите…', namePh: 'Ваше имя', message: 'Сообщение', messagePh: 'Продукт, спецификация, упаковка, страна доставки…', disclaimer: 'Я согласен, чтобы Sheer Superfood связалась со мной по этому запросу на ингредиенты.', button: 'Отправить запрос', description: 'Укажите порошок, спецификацию и объём.', waTitle: 'Чат в WhatsApp', waSub: 'Сначала краткие данные, затем продолжим в WhatsApp.', waBtn: 'Перейти в WhatsApp', waDesc: 'Мы сохраняем запрос и открываем WhatsApp.', waDisc: 'Вы соглашаетесь на связь по этому запросу по почте или в WhatsApp.', close: 'Закрыть', preferChat: 'Удобнее чат?' },
  ja: { company: '属性', channel: 'ご用件', volume: '数量', product: '製品', productPh: '原料と規格', name: 'お名前', email: 'メール', select: '選択…', namePh: 'お名前', message: 'メッセージ', messagePh: '製品、規格、包装、仕向国…', disclaimer: 'この原料のお問い合わせについて、Sheer Superfood からの連絡に同意します。', button: '問い合わせを送る', description: '必要な粉末、規格、数量をお知らせください。', waTitle: 'WhatsAppでチャット', waSub: '先に簡単な情報を。続きは WhatsApp です。', waBtn: 'WhatsAppへ', waDesc: '問い合わせを保存してから WhatsApp を開きます。', waDisc: 'この問い合わせについてメールまたは WhatsApp での連絡に同意します。', close: '閉じる', preferChat: 'チャットがよいですか？' },
  ko: { company: '저는', channel: '원하는 것', volume: '수량', product: '제품', productPh: '원료와 규격', name: '이름', email: '이메일', select: '선택…', namePh: '이름', message: '메시지', messagePh: '제품, 규격, 포장, 도착 국가…', disclaimer: '이번 원료 문의에 대해 Sheer Superfood가 연락하는 데 동의합니다.', button: '문의 보내기', description: '필요한 분말, 규격, 수량을 알려 주세요.', waTitle: 'WhatsApp 채팅', waSub: '간단한 정보 먼저, 이어서 WhatsApp으로 진행합니다.', waBtn: 'WhatsApp으로 계속', waDesc: '문의를 저장한 뒤 WhatsApp을 엽니다.', waDisc: '이 문의에 대해 이메일 또는 WhatsApp 연락에 동의합니다.', close: '닫기', preferChat: '채팅이 나을까요?' },
  ar: { company: 'أنا', channel: 'أبحث عن', volume: 'الكمية', product: 'المنتج', productPh: 'المكوّن والمواصفة', name: 'الاسم', email: 'البريد', select: 'اختر…', namePh: 'اسمك', message: 'الرسالة', messagePh: 'المنتج والمواصفة والتعبئة وبلد الوصول…', disclaimer: 'أوافق على تواصل Sheer Superfood بخصوص هذا الاستفسار عن المكوّنات.', button: 'إرسال الاستفسار', description: 'أخبرنا بالمسحوق والمواصفة والكمية.', waTitle: 'محادثة واتساب', waSub: 'بيانات سريعة أولاً، ثم نتابع على واتساب.', waBtn: 'المتابعة إلى واتساب', waDesc: 'نحفظ الاستفسار ثم نفتح واتساب.', waDisc: 'توافق على التواصل بخصوص هذا الاستفسار عبر البريد أو واتساب.', close: 'إغلاق', preferChat: 'تفضل الدردشة؟' },
  id: { company: 'Saya', channel: 'Saya mencari', volume: 'Jumlah', product: 'Produk', productPh: 'Bahan dan spesifikasi', name: 'Nama', email: 'Email', select: 'Pilih…', namePh: 'Nama Anda', message: 'Pesan', messagePh: 'Produk, spesifikasi, kemasan, negara tujuan…', disclaimer: 'Saya setuju dihubungi Sheer Superfood mengenai pertanyaan bahan ini.', button: 'Kirim pertanyaan', description: 'Sebutkan bubuk, spesifikasi, dan volume yang dibutuhkan.', waTitle: 'Chat WhatsApp', waSub: 'Data singkat dulu, lalu lanjut di WhatsApp.', waBtn: 'Lanjut ke WhatsApp', waDesc: 'Kami simpan pertanyaan lalu membuka WhatsApp.', waDisc: 'Anda setuju kami menghubungi Anda tentang pertanyaan ini via email atau WhatsApp.', close: 'Tutup', preferChat: 'Lebih suka chat?' },
  vi: { company: 'Tôi là', channel: 'Tôi cần', volume: 'Số lượng', product: 'Sản phẩm', productPh: 'Nguyên liệu và quy cách', name: 'Tên', email: 'Email', select: 'Chọn…', namePh: 'Tên của bạn', message: 'Tin nhắn', messagePh: 'Sản phẩm, quy cách, đóng gói, nước nhận hàng…', disclaimer: 'Tôi đồng ý Sheer Superfood liên hệ về yêu cầu nguyên liệu này.', button: 'Gửi yêu cầu', description: 'Cho biết bột, quy cách và khối lượng bạn cần.', waTitle: 'Chat WhatsApp', waSub: 'Vài thông tin trước, sau đó tiếp tục trên WhatsApp.', waBtn: 'Tiếp tục tới WhatsApp', waDesc: 'Chúng tôi lưu yêu cầu rồi mở WhatsApp.', waDisc: 'Bạn đồng ý chúng tôi liên hệ về yêu cầu này qua email hoặc WhatsApp.', close: 'Đóng', preferChat: 'Thích chat hơn?' },
};

export type FormStatusCopy = {
  success: string;
  error: string;
  missingMessage: string;
  required: string;
  invalidEmail: string;
  sending: string;
  turnstileExpired: string;
  turnstileError: string;
  turnstileTimeout: string;
  turnstileLoad: string;
  turnstileMissing: string;
  turnstileIncomplete: string;
};

export const FORM_STATUS: Record<Locale, FormStatusCopy> = {
  en: { success: 'We have received your message and will reply as soon as possible.', error: 'Sending failed. Please try again later or contact us via WhatsApp.', missingMessage: 'Please enter your message', required: 'This field is required', invalidEmail: 'Please enter a valid email address', sending: 'Sending...', turnstileExpired: 'Verification expired. Please try again.', turnstileError: 'Turnstile error. Please refresh and try again.', turnstileTimeout: 'Verification timed out. Please try again.', turnstileLoad: 'Failed to load human verification. Please refresh the page.', turnstileMissing: 'Human verification is not configured. Please contact us via WhatsApp.', turnstileIncomplete: 'Please complete the Cloudflare verification.' },
  zh: { success: '我们已收到您的信息，会尽快回复。', error: '发送失败。请稍后再试，或通过 WhatsApp 联系我们。', missingMessage: '请填写留言', required: '此项必填', invalidEmail: '请输入有效的邮箱地址', sending: '发送中...', turnstileExpired: '验证已过期，请重试。', turnstileError: '验证出错，请刷新后重试。', turnstileTimeout: '验证超时，请重试。', turnstileLoad: '人机验证加载失败，请刷新页面。', turnstileMissing: '尚未配置人机验证。请通过 WhatsApp 联系我们。', turnstileIncomplete: '请完成 Cloudflare 验证。' },
  'zh-tw': { success: '我們已收到您的訊息，會盡快回覆。', error: '傳送失敗。請稍後再試，或透過 WhatsApp 聯絡我們。', missingMessage: '請填寫訊息', required: '此項必填', invalidEmail: '請輸入有效的 Email', sending: '傳送中...', turnstileExpired: '驗證已過期，請再試一次。', turnstileError: '驗證出錯，請重新整理後再試。', turnstileTimeout: '驗證逾時，請再試一次。', turnstileLoad: '人機驗證載入失敗，請重新整理頁面。', turnstileMissing: '尚未設定人機驗證。請透過 WhatsApp 聯絡我們。', turnstileIncomplete: '請完成 Cloudflare 驗證。' },
  es: { success: 'Hemos recibido su mensaje y responderemos lo antes posible.', error: 'El envío falló. Inténtelo más tarde o contáctenos por WhatsApp.', missingMessage: 'Escriba su mensaje', required: 'Este campo es obligatorio', invalidEmail: 'Introduzca un email válido', sending: 'Enviando...', turnstileExpired: 'La verificación caducó. Inténtelo de nuevo.', turnstileError: 'Error de verificación. Actualice la página e inténtelo de nuevo.', turnstileTimeout: 'La verificación agotó el tiempo. Inténtelo de nuevo.', turnstileLoad: 'No se pudo cargar la verificación. Actualice la página.', turnstileMissing: 'La verificación no está configurada. Contáctenos por WhatsApp.', turnstileIncomplete: 'Complete la verificación de Cloudflare.' },
  pt: { success: 'Recebemos sua mensagem e responderemos o quanto antes.', error: 'O envio falhou. Tente de novo mais tarde ou fale conosco no WhatsApp.', missingMessage: 'Escreva sua mensagem', required: 'Este campo é obrigatório', invalidEmail: 'Informe um e-mail válido', sending: 'Enviando...', turnstileExpired: 'A verificação expirou. Tente de novo.', turnstileError: 'Erro de verificação. Atualize a página e tente de novo.', turnstileTimeout: 'A verificação expirou o tempo. Tente de novo.', turnstileLoad: 'Não foi possível carregar a verificação. Atualize a página.', turnstileMissing: 'A verificação não está configurada. Fale conosco no WhatsApp.', turnstileIncomplete: 'Conclua a verificação da Cloudflare.' },
  fr: { success: 'Nous avons reçu votre message et répondrons dès que possible.', error: 'L’envoi a échoué. Réessayez plus tard ou contactez-nous sur WhatsApp.', missingMessage: 'Saisissez votre message', required: 'Ce champ est obligatoire', invalidEmail: 'Saisissez une adresse e-mail valide', sending: 'Envoi...', turnstileExpired: 'La vérification a expiré. Réessayez.', turnstileError: 'Erreur de vérification. Actualisez la page et réessayez.', turnstileTimeout: 'La vérification a expiré. Réessayez.', turnstileLoad: 'Impossible de charger la vérification. Actualisez la page.', turnstileMissing: 'La vérification n’est pas configurée. Contactez-nous sur WhatsApp.', turnstileIncomplete: 'Terminez la vérification Cloudflare.' },
  de: { success: 'Wir haben Ihre Nachricht erhalten und antworten so bald wie möglich.', error: 'Senden fehlgeschlagen. Bitte später erneut versuchen oder uns per WhatsApp kontaktieren.', missingMessage: 'Bitte Nachricht eingeben', required: 'Dieses Feld ist erforderlich', invalidEmail: 'Bitte eine gültige E-Mail-Adresse eingeben', sending: 'Wird gesendet...', turnstileExpired: 'Die Prüfung ist abgelaufen. Bitte erneut versuchen.', turnstileError: 'Prüfungsfehler. Bitte Seite neu laden und erneut versuchen.', turnstileTimeout: 'Die Prüfung hat zu lange gedauert. Bitte erneut versuchen.', turnstileLoad: 'Die Prüfung konnte nicht geladen werden. Bitte Seite neu laden.', turnstileMissing: 'Die Prüfung ist nicht eingerichtet. Bitte per WhatsApp kontaktieren.', turnstileIncomplete: 'Bitte die Cloudflare-Prüfung abschließen.' },
  it: { success: 'Abbiamo ricevuto il messaggio e risponderemo al più presto.', error: 'Invio non riuscito. Riprovi più tardi o ci contatti su WhatsApp.', missingMessage: 'Inserisca il messaggio', required: 'Questo campo è obbligatorio', invalidEmail: 'Inserisca un indirizzo email valido', sending: 'Invio...', turnstileExpired: 'La verifica è scaduta. Riprovi.', turnstileError: 'Errore di verifica. Aggiorni la pagina e riprovi.', turnstileTimeout: 'Tempo di verifica scaduto. Riprovi.', turnstileLoad: 'Impossibile caricare la verifica. Aggiorni la pagina.', turnstileMissing: 'La verifica non è configurata. Ci contatti su WhatsApp.', turnstileIncomplete: 'Completi la verifica Cloudflare.' },
  ru: { success: 'Мы получили ваше сообщение и ответим как можно скорее.', error: 'Отправка не удалась. Повторите позже или напишите нам в WhatsApp.', missingMessage: 'Введите сообщение', required: 'Это поле обязательно', invalidEmail: 'Введите действительный адрес почты', sending: 'Отправка...', turnstileExpired: 'Проверка истекла. Повторите попытку.', turnstileError: 'Ошибка проверки. Обновите страницу и повторите.', turnstileTimeout: 'Время проверки истекло. Повторите попытку.', turnstileLoad: 'Не удалось загрузить проверку. Обновите страницу.', turnstileMissing: 'Проверка не настроена. Напишите нам в WhatsApp.', turnstileIncomplete: 'Пройдите проверку Cloudflare.' },
  ja: { success: 'メッセージを受け取りました。できるだけ早く返信します。', error: '送信に失敗しました。しばらくしてから再度お試しになるか、WhatsApp でご連絡ください。', missingMessage: 'メッセージを入力してください', required: '必須項目です', invalidEmail: '有効なメールアドレスを入力してください', sending: '送信中...', turnstileExpired: '確認の期限が切れました。もう一度お試しください。', turnstileError: '確認エラーです。ページを更新してもう一度お試しください。', turnstileTimeout: '確認がタイムアウトしました。もう一度お試しください。', turnstileLoad: '確認を読み込めませんでした。ページを更新してください。', turnstileMissing: '確認が設定されていません。WhatsApp でご連絡ください。', turnstileIncomplete: 'Cloudflare の確認を完了してください。' },
  ko: { success: '메시지를 받았습니다. 가능한 한 빨리 답변드리겠습니다.', error: '전송에 실패했습니다. 나중에 다시 시도하거나 WhatsApp으로 연락해 주세요.', missingMessage: '메시지를 입력해 주세요', required: '필수 항목입니다', invalidEmail: '유효한 이메일을 입력해 주세요', sending: '전송 중...', turnstileExpired: '확인이 만료되었습니다. 다시 시도해 주세요.', turnstileError: '확인 오류입니다. 페이지를 새로고침한 뒤 다시 시도해 주세요.', turnstileTimeout: '확인 시간이 초과되었습니다. 다시 시도해 주세요.', turnstileLoad: '확인을 불러오지 못했습니다. 페이지를 새로고침해 주세요.', turnstileMissing: '확인이 설정되지 않았습니다. WhatsApp으로 연락해 주세요.', turnstileIncomplete: 'Cloudflare 확인을 완료해 주세요.' },
  ar: { success: 'استلمنا رسالتك وسنرد في أقرب وقت.', error: 'فشل الإرسال. أعد المحاولة لاحقًا أو تواصل معنا عبر واتساب.', missingMessage: 'أدخل الرسالة', required: 'هذا الحقل مطلوب', invalidEmail: 'أدخل بريدًا إلكترونيًا صالحًا', sending: 'جارٍ الإرسال...', turnstileExpired: 'انتهت صلاحية التحقق. أعد المحاولة.', turnstileError: 'خطأ في التحقق. حدّث الصفحة وأعد المحاولة.', turnstileTimeout: 'انتهت مهلة التحقق. أعد المحاولة.', turnstileLoad: 'تعذر تحميل التحقق. حدّث الصفحة.', turnstileMissing: 'التحقق غير مُعد. تواصل معنا عبر واتساب.', turnstileIncomplete: 'أكمل تحقق Cloudflare.' },
  id: { success: 'Kami telah menerima pesan Anda dan akan membalas secepatnya.', error: 'Pengiriman gagal. Coba lagi nanti atau hubungi kami lewat WhatsApp.', missingMessage: 'Masukkan pesan Anda', required: 'Bidang ini wajib diisi', invalidEmail: 'Masukkan alamat email yang valid', sending: 'Mengirim...', turnstileExpired: 'Verifikasi kedaluwarsa. Coba lagi.', turnstileError: 'Verifikasi gagal. Muat ulang halaman dan coba lagi.', turnstileTimeout: 'Verifikasi habis waktu. Coba lagi.', turnstileLoad: 'Verifikasi gagal dimuat. Muat ulang halaman.', turnstileMissing: 'Verifikasi belum diatur. Hubungi kami lewat WhatsApp.', turnstileIncomplete: 'Selesaikan verifikasi Cloudflare.' },
  vi: { success: 'Chúng tôi đã nhận tin nhắn và sẽ trả lời sớm nhất.', error: 'Gửi không thành công. Hãy thử lại sau hoặc liên hệ qua WhatsApp.', missingMessage: 'Vui lòng nhập tin nhắn', required: 'Trường này là bắt buộc', invalidEmail: 'Vui lòng nhập email hợp lệ', sending: 'Đang gửi...', turnstileExpired: 'Xác minh đã hết hạn. Hãy thử lại.', turnstileError: 'Lỗi xác minh. Hãy tải lại trang và thử lại.', turnstileTimeout: 'Xác minh quá thời gian. Hãy thử lại.', turnstileLoad: 'Không tải được bước xác minh. Hãy tải lại trang.', turnstileMissing: 'Chưa cấu hình xác minh. Hãy liên hệ qua WhatsApp.', turnstileIncomplete: 'Hãy hoàn tất xác minh Cloudflare.' },
};

const EXTRA_LABELS: Partial<Record<Locale, { phone: string; company: string }>> & { en: { phone: string; company: string } } = {
  en: { phone: 'Phone / WhatsApp (optional)', company: 'Company (optional)' },
  zh: { phone: '电话 / WhatsApp（选填）', company: '公司（选填）' },
  'zh-tw': { phone: '電話 / WhatsApp（選填）', company: '公司（選填）' },
};

function opts(rows: OptionRow[], locale: Locale) {
  return rows.map((row) => ({ value: row.value, label: row[locale] || row.en }));
}

export function getInquiryForm(locale: Locale) {
  const l = LABELS[locale];
  const x = EXTRA_LABELS[locale] || EXTRA_LABELS.en;
  const inputs: Input[] = [
    { type: 'text', name: 'name', label: l.name, placeholder: l.namePh },
    { type: 'email', name: 'email', label: l.email, placeholder: 'you@company.com' },
    { type: 'tel', name: 'phone', label: x.phone, autocomplete: 'tel', required: false },
    { type: 'text', name: 'product', label: l.product, placeholder: l.productPh, required: true },
    { type: 'text', name: 'company', label: x.company, autocomplete: 'organization', required: false },
    { type: 'select', name: 'channel', label: l.channel, placeholder: l.select, required: false, options: opts(CHANNEL, locale) },
    { type: 'select', name: 'volume', label: l.volume, placeholder: l.select, required: false, options: opts(VOLUME, locale) },
  ];
  const textarea: Textarea = { label: l.message, name: 'message', placeholder: l.messagePh, rows: 3, required: false };
  const disclaimer: Disclaimer = { label: l.disclaimer };
  return {
    inputs,
    textarea,
    disclaimer,
    button: l.button,
    description: l.description,
    close: l.close,
    preferChat: l.preferChat,
    waLink: l.waTitle,
    waLead: {
      inputs,
      textarea: { ...textarea, rows: 2 },
      disclaimer: { label: l.waDisc },
      button: l.waBtn,
      description: l.waDesc,
      title: l.waTitle,
      subtitle: l.waSub,
    },
  };
}
