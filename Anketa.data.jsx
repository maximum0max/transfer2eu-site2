// Data for the native guest-registration form (rebuilt from the Google Form
// "Datos obligatorios del huésped para el registro en Guardia Civil").
// Everything the /anketa page renders is driven from here: UI strings, the 13
// field definitions and the country list — all in RU / EN / ES.
//
// Stored values (what lands in the Google Sheet) are canonical and
// language-independent: choice fields store a fixed value, country fields store
// the English country name. Only the on-screen label changes with language.

export const LANGS = [
  { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
];

export const UI = {
  ru: {
    title: 'Обязательные данные гостя для регистрации в Guardia Civil',
    desc: 'Все данные обрабатываются конфиденциально и используются только для регистрации в органах (Guardia Civil).',
    submit: 'Отправить',
    sending: 'Отправка…',
    success: 'Спасибо! Данные отправлены.',
    successSub: 'Регистрация принята. Можно закрыть эту страницу.',
    error: 'Не удалось отправить. Проверьте соединение и попробуйте ещё раз.',
    required: 'Заполните обязательные поля',
    choose: '— выберите —',
    optional: '(необязательно)',
    again: 'Отправить ещё одну',
  },
  en: {
    title: 'Mandatory guest data for Guardia Civil registration',
    desc: 'All data is treated confidentially and used only for registration with the authorities (Guardia Civil).',
    submit: 'Submit',
    sending: 'Sending…',
    success: 'Thank you! Your data has been sent.',
    successSub: 'Your registration has been received. You may close this page.',
    error: 'Could not send. Check your connection and try again.',
    required: 'Please fill in the required fields',
    choose: '— select —',
    optional: '(optional)',
    again: 'Submit another',
  },
  es: {
    title: 'Datos obligatorios del huésped para el registro en Guardia Civil',
    desc: 'Todos los datos se tratan de forma confidencial y se usan únicamente para el registro ante las autoridades (Guardia Civil).',
    submit: 'Enviar',
    sending: 'Enviando…',
    success: '¡Gracias! Tus datos han sido enviados.',
    successSub: 'Tu registro ha sido recibido. Puedes cerrar esta página.',
    error: 'No se pudo enviar. Comprueba la conexión e inténtalo de nuevo.',
    required: 'Rellena los campos obligatorios',
    choose: '— seleccione —',
    optional: '(opcional)',
    again: 'Enviar otro',
  },
};

const L = (ru, en, es) => ({ ru, en, es });

// The 13 fields, in the original order. `type`: text | date | radio | country.
export const FIELDS = [
  { key: 'nombre', type: 'text', required: true, label: L('Имя', 'First name', 'Nombre') },
  { key: 'primerApellido', type: 'text', required: true, label: L('Фамилия', 'First surname', 'Primer Apellido') },
  { key: 'segundoApellido', type: 'text', required: false, label: L('Вторая фамилия', 'Second surname', 'Segundo Apellido') },
  { key: 'fechaNacimiento', type: 'date', required: true, label: L('Дата рождения', 'Date of birth', 'Fecha de nacimiento') },
  { key: 'nacionalidad', type: 'country', required: true, label: L('Гражданство', 'Nationality', 'Nacionalidad') },
  {
    key: 'tipoDocumento', type: 'radio', required: true,
    label: L('Тип документа', 'Document type', 'Tipo de documento'),
    options: [
      { value: 'NIE', label: L('NIE', 'NIE', 'NIE') },
      { value: 'DNI', label: L('DNI', 'DNI', 'DNI') },
      { value: 'Passport', label: L('Паспорт', 'Passport', 'Pasaporte') },
    ],
  },
  { key: 'numeroDocumento', type: 'text', required: true, label: L('Номер документа', 'Document number', 'Número de documento') },
  { key: 'fechaExpedicion', type: 'date', required: true, label: L('Дата выдачи документа', 'Document issue date', 'Fecha de expedición del documento') },
  { key: 'nombreAlojamiento', type: 'text', required: true, label: L('Название жилья', 'Accommodation name', 'Nombre del alojamiento') },
  { key: 'fechaEntrada', type: 'date', required: true, label: L('Дата заезда', 'Check-in date', 'Fecha de entrada al alojamiento') },
  { key: 'fechaSalida', type: 'date', required: true, label: L('Дата выезда', 'Check-out date', 'Fecha de salida del alojamiento') },
  {
    key: 'sexo', type: 'radio', required: true,
    label: L('Пол', 'Sex', 'Sexo'),
    options: [
      { value: 'Male', label: L('Мужской', 'Male', 'Hombre') },
      { value: 'Female', label: L('Женский', 'Female', 'Mujer') },
      { value: 'Prefer not to say', label: L('Предпочитаю не указывать', 'Prefer not to say', 'Prefiero no decirlo') },
      { value: 'Other', label: L('Другое', 'Other', 'Otro') },
    ],
  },
  { key: 'paisResidencia', type: 'country', required: true, label: L('Страна постоянного проживания', 'Country of habitual residence', 'País de residencia habitual') },
];

// Canonical country list (English names). Used for both country dropdowns so the
// value stored in the Sheet is consistent across languages.
export const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia',
  'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium',
  'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria',
  'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Central African Republic', 'Chad',
  'Chile', 'China', 'Colombia', 'Comoros', 'Congo (Brazzaville)', 'Congo (Kinshasa)', 'Costa Rica', 'Croatia',
  'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt',
  'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France',
  'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau',
  'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel',
  'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kosovo', 'Kuwait',
  'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania',
  'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania',
  'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique',
  'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria',
  'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama',
  'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia',
  'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino',
  'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore',
  'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain',
  'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania',
  'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan',
  'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay',
  'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe',
];
