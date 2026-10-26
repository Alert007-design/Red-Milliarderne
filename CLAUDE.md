<!-- FASTE REGLER START -->
# Faste regler for arbejdet med Morten

Et projekts egne regler i samme fil går forud for disse faste regler, hvis
de peger forskellige veje. Siger et projekt fx, at der aldrig må pushes
direkte til main, gælder det.

## Om mig
Jeg har ingen kodeerfaring. Forklar alt på almindeligt dansk uden fagsprog. Når
jeg selv skal gøre noget (Airtable, Vercel, Meta, Stripe, one.com osv.), så giv
mig en klik-for-klik-vejledning. Stil spørgsmål, hvis noget er uklart, frem for
at gætte.

## Fast rækkefølge ved enhver større funktion: Plan → Tests → Byg → Push
1. PLAN FØRST. Ret ikke i nogen filer, før jeg har godkendt en plan. Planen
   skal vise: hvilke filer der ændres, i hvilken rækkefølge, hvad der kan gå
   galt, og om det rører ved betaling, persondata eller noget, der sender
   automatisk til andre mennesker.
2. TESTS FØR KODE. Skriv automatiske tests først, inkl. fejlsituationer. De
   skal fejle fra start. Byg derefter funktionen, indtil alle tests består.
3. AFSLUT SIKKERT. Kør typecheck, lint og build. Kun hvis alt består: commit
   med en kort dansk besked og push til GitHub. Vercel bygger derefter selv.
   Mind mig om at tjekke den rigtige side, når den er ude.
Små rettelser (tekst, farver, en enkelt fejl) kræver ikke hele forløbet, men
sig altid kort, hvad du ændrer, før du gør det.

## Særlig forsigtighed
Ved betaling (Viva), persondata og alt, der svarer automatisk på Facebook:
ingen auto-accept. Vis hver ændring, og vent på mit ja.

## Mit miljø (gælder kun lokalt på min pc)
Node ligger i C:\ft\node, npm bruger C:\ft\npm-cache og C:\ft\npm-global.
Programmer må kun køre fra C:\ft. PowerShell kører i begrænset sprogtilstand,
så filer skrives med skriveværktøjet, ikke med scripts. Tests (vitest) kan
ikke køres her, fordi Node ikke må starte esbuild.exe – kør typecheck, lint og
build lokalt, og kør tests i en cloud-session. GitHub CLI findes ikke her,
så pull requests kan hverken oprettes eller flettes lokalt (se næste afsnit).

## Pull requests og fletning
Jeg fletter ikke selv på github.com. Gør så meget som muligt selv, så jeg
ikke skal tage tekniske trin og risikere fejl.
- I en cloud-session (claude.ai/code): opret selv pull requestet, kør tests,
  og flet det, når typecheck, lint, build og tests er grønne. Følg bagefter
  udrulningen på Vercel, og sig til, når ændringen er ude, eller hvad der
  fejlede.
- Lokalt på min pc: push grenen, og skriv kort, at den flettes fra en
  cloud-session. Bed mig ikke om at oprette eller flette pull requests.
- Spørg mig først og vent på et klart ja, før du fletter noget, der rammer
  rigtige brugere: udsendelse af mails eller sms, tilmelding, samtykke,
  privatlivspolitik og persondata, afmelding og sletning, betaling, at gøre
  en side offentlig eller pege et domæne over, og sletning af data.
  Almindelige rettelser, jeg har bedt om, fletter du uden at spørge.
- Fejler tests eller build, flettes der ikke.

## Når noget går galt
Stop. Forklar, hvad der er sket, og hvordan vi ruller tilbage, før du gør mere.

## Planen ligger i filer, så en ny session kan fortsætte
Ved enhver større funktion oprettes mappen `plan/` i repoet med tre filer:
- `plan/SPEC.md` – hvad funktionen skal kunne, skrevet på dansk, før der
  skrives kode. Jeg godkender den først.
- `plan/OPGAVER.md` – specifikationen brudt ned i små opgaver i rækkefølge,
  med en afkrydsning [ ] foran hver. Hver opgave skal kunne bygges og
  kontrolleres for sig.
- `plan/STATUS.md` – tre linjer: hvad der er færdigt, hvad der er i gang,
  og hvad der mangler. Opdateres hver gang en opgave er færdig.
Byg én opgave ad gangen. Afkryds den i OPGAVER.md, når den er bygget og
kontrolleret (typecheck, lint, build; tests i cloud-sessionen). Start altid
en ny session med at læse plan/STATUS.md og plan/OPGAVER.md og fortsæt, hvor
den forrige slap. Når funktionen er helt færdig og pushet, slettes mappen.

## Sprog i alt, der vises for mennesker
Alt, der kan læses af andre end mig – tekster på sider, knapper,
fejlmeddelelser, mails, nyhedsbreve, opslag – skrives på korrekt, naturligt
dansk. Det må ikke kunne ses, at en AI har været med. Derfor:
- Ingen opremsninger i tre for rytmens skyld. Skriv det antal, der er.
- Ingen "ikke blot X, men Y"-konstruktioner.
- Ingen hype-ord: banebrydende, revolutionerende, sømløs, kraftfuld,
  effektiv (som fyldord), i dag mere end nogensinde, i en verden hvor.
- Ingen afslutninger af typen "Klar til at komme i gang?" eller "Lad os".
- Ingen lange tankestreger (—). Brug kort tankestreg med mellemrum ( – ),
  og brug den sjældent.
- Ingen overskrifter, der er spørgsmål, og ingen punktopstillinger i tekst,
  der skal læses som almindelig prosa.
- Ingen anglicismer: "dykke ned i", "italesætte", "navigere" (om andet end
  skibe), "udfordring" i stedet for problem, "tage ejerskab".
- Variér sætningslængden. En lang sætning må gerne følges af en helt kort.
- Konkrete tal og navne frem for "mange", "en række", "diverse".
- Teknisk tekst (kode, kommentarer, commits) må være kort og nøgtern, men
  stadig dansk.
<!-- FASTE REGLER SLUT -->
