import i18n from 'i18n-js';
import * as Localization from 'expo-localization';

import af from './af.json';
import ar from './ar.json';
import ca from './ca.json';
import cs from './cs.json';
import da from './da.json';
import de from './de.json';
import en from './en.json';
import el from './el.json';
import es from './es.json';
import fa from './fa.json';
import fi from './fi.json';
import fr from './fr.json';
import hu from './hu.json';
import id from './id.json';
import it from './it.json';
import ja from './ja.json';
import ko from './ko.json';
import ml from './ml.json';
import nl from './nl.json';
import no from './no.json';
import pl from './pl.json';
import pt_BR from './pt_BR.json';
import pt from './pt.json';
import ro from './ro.json';
import ru from './ru.json';
import sr from './sr.json';
import sv from './sv.json';
import ta from './ta.json';
import tr from './tr.json';
import uk from './uk.json';
import vi from './vi.json';
import zh from './zh.json';

i18n.translations = {
  af,
  ar,
  ca,
  cs,
  da,
  de,
  en,
  el,
  es,
  fa,
  fi,
  fr,
  hu,
  id,
  it,
  ja,
  ko,
  ml,
  nl,
  no,
  pl,
  pt_BR,
  pt,
  ro,
  ru,
  sr,
  sv,
  ta,
  tr,
  uk,
  vi,
  zh,
};

export const getBestLocale = () => {
  const deviceLocales = Localization.getLocales();
  for (const locale of deviceLocales) {
    // Try full language tag (e.g., "en-US", "pt-BR")
    if (i18n.translations[locale.languageTag]) {
      return locale.languageTag;
    }
    // Try with underscore format (device uses "pt-BR", app uses "pt_BR")
    const underscoreTag = locale.languageTag.replace('-', '_');
    if (i18n.translations[underscoreTag]) {
      return underscoreTag;
    }
    // Try language code (e.g., "en", "pt")
    if (i18n.translations[locale.languageCode]) {
      return locale.languageCode;
    }
  }
  return 'en'; // Fallback to English
};

i18n.locale = getBestLocale();
i18n.fallbacks = true;

export default i18n;


