# derech-kohanim-shared

מקור האמת היחיד לחוזה ה-API ולשפת העיצוב של כל רכיבי המוצר.

כל רכיב יושב בריפו נפרד, זה לצד זה תחת תיקיית הפרויקט:

```
derech-kohanim-project/
  derech-kohanim-shared/     <- כאן
  derech-kohanim-api/        שרת NestJS
  derech-kohanim-web/        אתר Vite + React
  derech-kohanim-android/    אפליקציה Kotlin + Compose
  derech-kohanim-poc/        הוכחת ההיתכנות, לקריאה בלבד
```

## מה יש כאן

```
src/types/     חוזה ה-API. משותף לשרת, לאתר ולאפליקציה
src/design/    טוקני העיצוב והמחולל שכותב אותם לכל פלטפורמה
```

## שפת העיצוב

`src/design/tokens.ts` הוא **המקום היחיד** שבו מוגדרים צבעים, רדיוסים, מרווחים, טיפוגרפיה, צללים ותנועה. אין להטמיע ערך עיצובי קשיח באף רכיב.

לאחר שינוי טוקן:

```bash
npm run tokens
```

הפקודה כותבת אוטומטית לריפוזים השכנים:

```
derech-kohanim-web/src/styles/tokens.css
derech-kohanim-android/app/src/main/java/org/derechkohanim/app/ui/theme/Tokens.kt
```

כך שינוי צבע אחד מתעדכן באתר ובאפליקציה יחד, וניתן להחליף שפה עיצובית שלמה בלי לגעת ברכיבים.

## שימוש מהריפוזים האחרים

הריפוזים מתקינים את החבילה מהתיקייה השכנה:

```json
"dependencies": {
  "@dk/shared": "file:../derech-kohanim-shared"
}
```

וייבוא הטיפוסים נעשה כך:

```ts
import type { RouteResult, PlaceSuggestion } from '@dk/shared';
```

## התקנה

```bash
npm install
npm run tokens
```
