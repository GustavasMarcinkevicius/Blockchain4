# Verslo modelis — „Automobilių nuoma su depozitu ir technine patikra“

Šis verslo modelis skirtas automobilių nuomos paslaugoms, kur saugumas ir skaidrumas yra svarbiausi. Modelis remiasi decentralizuota išmaniąja sutartimi, kuri užtikrina:

- skaidrų depozitų valdymą,

- nuomos mokesčių tvarkymą,

- techninės patikros rezultatus prieš ir po nuomos,

- automatizuotą pinigų grąžinimą arba pasilikimą, jei atsiranda žala.

Išmanioji sutartis veikia kaip tarpininkas, kuris kontroliuoja pinigų srautus tarp nuomotojo ir nuomininko ir praneša apie visus svarbius įvykius. Šis modelis sumažina ginčų riziką, užtikrina sąžiningumą ir leidžia dalyviams pasitikėti procesu be tarpininkų.

## Pagrindiniai veikėjai:

- Nuomotojas (Owner) — tas, kas siūlo automobilį nuomai. Valdo automobilio informaciją, patvirtina rezervacijas, gali pareikšti pretenziją dėl žalos.

- Nuomininkas (Renter) — rezervuoja automobilį, sumoka depozitą ir nuomos mokestį (ar dalį), naudojasi automobiliu.

- Mechanikas / Inspektorius (Mechanic) — atlikinėja techninę patikrą prieš nuomą (prieš atidavimą) ir po nuomos (grąžinimo metu). Gali patvirtinti, kad automobilis tvarkingas arba nurodyti žalą.

- Išmanioji sutartis (Smart Contract) — escrow funkcija: saugo depozitą, vykdo logiką (grąžinimas / pasilikimas / dalinis atlygis), leidžia tik patvirtintiems veikėjams vykdyti tam tikras funkcijas.



## Sekų diagrama:

###  Sekų diagrama vaizduoja pagrindinę nuomos proceso logiką tarp Nuomininko, Nuomotojo, Mechaniko ir Išmaniosios sutarties:

### Rezervacija
- Nuomininkas rezervuoja automobilį ir sumoka depozitą. Smart contract išsiunčia ReservationCreated event’ą nuomininkui ir praneša nuomotojui (ReservationNotification).

### Nuomos patvirtinimas ir priešnuomos inspekcija
- Nuomotojas patvirtina rezervaciją (ReservationConfirmed). Mechanikas atlieka priešnuomos patikrą (preInspect). Smart contract siunčia atitinkamus event’us visiems dalyviams (PreInspectionCompleted).

### Nuomos ciklas
- Nuomininkas pradeda nuomą (startRental) ir ją užbaigia (endRental). Smart contract praneša apie nuomos pradžią ir pabaigą (RentalStarted, RentalEnded).

### Post-inspekcija
- Mechanikas tikrina automobilį po nuomos (postInspect). Jei nėra žalos, Smart contract depozitą naudoja sąskaitai apmokėti ir pažymi nuomą kaip užbaigtą (RentalCompleted).

![Car Rental Escrow-2025-12-17-124340](https://github.com/user-attachments/assets/de120eda-7153-4296-986d-75753dd00f7a)

## Tipiniai scenarijai
### 1. Standartinė nuoma be jokių problemų

- Nuomininkas rezervuoja automobilį ir sumoka depozitą + nuomos mokestį.

- Nuomotojas patvirtina rezervaciją.

- Mechanikas atlieka priešnuomos patikrą – automobilis tvarkingas.

- Nuomininkas pradeda ir užbaigia nuomą.

- Mechanikas tikrina automobilį po nuomos – nėra žalos.

- Smart contract pažymi nuomą kaip užbaigtą.

- Rezultatas: procesas vyksta sklandžiai, visi patenkinti.


### 2. Nuomos pabaigoje randama žala

- Nuomininkas pradeda ir užbaigia nuomą.

- Mechanikas tikrina automobilį po nuomos – randama žala.

- Smart contract pasilieka dalį arba visą depozitą, priklausomai nuo žalos dydžio.

- Nuomotojas gauna kompensaciją už žalą.

- Rezultatas: depozito valdymas automatizuotas, nuomotojas apsaugotas.


### 3. Ginčas dėl automobilio būklės

- Nuomos pabaigoje nuomotojas ir nuomininkas nesutaria dėl automobilio būklės: nuomotojas teigia, kad automobilis buvo sugadintas nuomos metu, o nuomininkas teigia, kad žala atsirado prieš nuomą.

- Mechanikas atlieka post-inspekciją ir pateikia objektyvią ataskaitą apie automobilio būklę.

- Smart contract, remdamasis Mechaniko ataskaita, automatiškai paskirsto depozitą:

- jei žalos nėra → depozitas grąžinamas nuomininkui,

- jei žala patvirtinta → depozitas pasilieka nuomotojui, kad padengtų nuostolius.

- Rezultatas: ginčas išsprendžiamas skaidriai ir automatiškai, užtikrinant teisingumą abiem pusėms.







Kontrakto deployinimias

<img width="1385" height="821" alt="image" src="https://github.com/user-attachments/assets/38e9d4b7-42da-4387-873a-8220b4e9034e" />

Front-end:

<img width="1912" height="959" alt="image" src="https://github.com/user-attachments/assets/3b8ab545-9735-4d65-949b-a6d958361de5" />
<img width="1911" height="840" alt="image" src="https://github.com/user-attachments/assets/64e4813b-bf3a-4963-aa7d-d19798f91d7f" />
<img width="1919" height="951" alt="image" src="https://github.com/user-attachments/assets/d51241b8-ee0e-480b-af5b-cc6771beff28" />


Automobilio pridėjimas:

<img width="393" height="577" alt="image" src="https://github.com/user-attachments/assets/6f7bcbeb-dd3f-4ae7-a74c-4b7dc63c02fa" />
<img width="471" height="755" alt="image" src="https://github.com/user-attachments/assets/f7dd2111-77f4-43a1-8a6a-3001548ec796" />


Automobilio patikra:

Jeigu bando patikrinti ne paskirtas mechanikas:

<img width="1918" height="914" alt="image" src="https://github.com/user-attachments/assets/3935a8bb-6a08-4bc1-bab8-df1332b9de0f" />
Kai bando atlikti mechanikas:

<img width="964" height="800" alt="image" src="https://github.com/user-attachments/assets/efc4e340-d905-4200-b635-86aaeed44690" />
Toliau galima tęsti nuomą:

<img width="1908" height="957" alt="image" src="https://github.com/user-attachments/assets/5f534b38-7720-46b0-b583-ccd4cebc091b" />



Etherscan pavyzdys:
<img width="1704" height="831" alt="image" src="https://github.com/user-attachments/assets/17f3350e-a9c2-440d-9e99-53dc1840c453" />



Galimas testavimas naudojant RemixIDE tiek lokaliai, tiek tinkle (priklauso nuo environment):
<img width="424" height="828" alt="image" src="https://github.com/user-attachments/assets/f85784f4-5ec5-4499-9068-84be46d209d2" />

