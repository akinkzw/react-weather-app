const WMO_CODES = {
  0:  { label: '快晴',              emoji: '☀️'  },
  1:  { label: '晴れ',              emoji: '🌤️' },
  2:  { label: '晴れ時々くもり',    emoji: '⛅'  },
  3:  { label: 'くもり',            emoji: '☁️'  },
  45: { label: '霧',                emoji: '🌫️' },
  48: { label: '霧（着氷性）',      emoji: '🌫️' },
  51: { label: '霧雨（弱）',        emoji: '🌦️' },
  53: { label: '霧雨',              emoji: '🌦️' },
  55: { label: '霧雨（強）',        emoji: '🌧️' },
  56: { label: '着氷性霧雨（弱）',  emoji: '🌧️' },
  57: { label: '着氷性霧雨（強）',  emoji: '🌧️' },
  61: { label: '雨（弱）',          emoji: '🌧️' },
  63: { label: '雨',                emoji: '🌧️' },
  65: { label: '雨（強）',          emoji: '🌧️' },
  66: { label: '着氷性の雨（弱）',  emoji: '🌧️' },
  67: { label: '着氷性の雨（強）',  emoji: '🌧️' },
  71: { label: '雪（弱）',          emoji: '❄️'  },
  73: { label: '雪',                emoji: '❄️'  },
  75: { label: '雪（強）',          emoji: '❄️'  },
  77: { label: '霰・みぞれ',        emoji: '🌨️' },
  80: { label: 'にわか雨（弱）',    emoji: '🌦️' },
  81: { label: 'にわか雨',          emoji: '🌦️' },
  82: { label: 'にわか雨（強）',    emoji: '🌦️' },
  85: { label: 'にわか雪（弱）',    emoji: '🌨️' },
  86: { label: 'にわか雪（強）',    emoji: '🌨️' },
  95: { label: '雷雨',              emoji: '⛈️'  },
  96: { label: '雷雨（雹あり）',    emoji: '⛈️'  },
  99: { label: '雷雨（大粒の雹）',  emoji: '⛈️'  },
};

export function getWeatherInfo(code) {
  return WMO_CODES[code] ?? { label: `天気コード ${code}`, emoji: '🌡️' };
}
