/* Hakiki Döner - menukaart data
   Prijzen in centen om afrondingsfouten te vermijden; render als € x,xx.
   from:true  -> "vanaf"
   Alleen beschikbare gerechten staan hier. Items die op Thuisbezorgd
   "uitverkocht / niet beschikbaar" zijn, worden weggelaten.
   Bijwerken kan met tools/sync-menu.mjs (zie tools/README.md). */

window.HAKIKI_MENU = [
  {
    id: "broodjes",
    title: "Broodjes",
    tag: "Vers Turks brood",
    blurb: "Warm Turks brood, van het spit gesneden, met verse groenten en saus naar keuze.",
    items: [
      { name: "Broodje döner", price: 750 },
      { name: "Broodje döner XL", price: 950 },
      { name: "Broodje kipdöner", price: 750 },
      { name: "Broodje kipdöner XL", price: 950 },
      { name: "Broodje falafel", price: 750 },
      { name: "Broodje falafel XL", price: 950 },
      { name: "Broodje adana", price: 800 },
      { name: "Broodje adana XL", price: 1000 },
      { name: "Broodje shoarma", price: 900 },
      { name: "Broodje shoarma XL", price: 1100 },
      { name: "Broodje gyros", price: 900 },
      { name: "Broodje gyros XL", price: 1100 },
      { name: "Broodje kipfilet", price: 900 },
      { name: "Broodje kipfilet XL", price: 1100 },
      { name: "Broodje yaprak", price: 1000 },
      { name: "Broodje yaprak XL", price: 1200 },
      { name: "Broodje hamburger", price: 500 }
    ]
  },
  {
    id: "durums",
    title: "Dürüms",
    tag: "Gerold in dun brood",
    blurb: "Dunne yufka wrap, strak gerold rond vlees, groenten en saus.",
    items: [
      { name: "Dürüm döner", price: 800 },
      { name: "Dürüm döner XL", price: 1000 },
      { name: "Dürüm kipdöner", price: 800 },
      { name: "Dürüm kipdöner XL", price: 1000 },
      { name: "Dürüm falafel", price: 800 },
      { name: "Dürüm falafel XL", price: 1000 },
      { name: "Dürüm adana", price: 850 },
      { name: "Dürüm adana XL", price: 1050 },
      { name: "Dürüm kipfilet", price: 900 },
      { name: "Dürüm kipfilet XL", price: 1100 },
      { name: "Dürüm shoarma", price: 900 },
      { name: "Dürüm shoarma XL", price: 1100 },
      { name: "Dürüm gyros", price: 900 },
      { name: "Dürüm gyros XL", price: 1100 },
      { name: "Dürüm yaprak", price: 1000 },
      { name: "Dürüm yaprak XL", price: 1200 },
      { name: "Dürüm sjaslik", price: 1000 }
    ]
  },
  {
    id: "schotels",
    title: "Schotels",
    tag: "Met friet & salade",
    blurb: "Ruim bord met vlees naar keuze, verse friet, salade en saus.",
    items: [
      { name: "Schotel hamburger", price: 1200, from: true },
      { name: "Schotel döner", price: 1500, from: true },
      { name: "Schotel kipdöner", price: 1500, from: true },
      { name: "Schotel falafel", price: 1500, from: true, desc: "10 stuks" },
      { name: "Schotel adana", price: 1650, from: true },
      { name: "Schotel kipfilet", price: 1650, from: true },
      { name: "Schotel gyros", price: 1650, from: true },
      { name: "Schotel sjasliek", price: 1650, from: true },
      { name: "Schotel shoarma", price: 1650, from: true },
      { name: "Schotel yaprak", price: 1800, from: true },
      { name: "Schotel kipfilet hot", price: 1650, from: true },
      { name: "Schotel shoarma hot", price: 1650, from: true },
      { name: "Schotel kipfilet champignons", price: 1700, from: true },
      { name: "Schotel shoarma champignons", price: 1700, from: true },
      { name: "Schotel kipfilet ananas", price: 1750, from: true },
      { name: "Schotel shoarma ananas", price: 1750, from: true },
      { name: "Schotel kipnuggets", price: 1200, from: true, desc: "10 stuks" }
    ]
  },
  {
    id: "schotels-speciaal",
    title: "Schotels speciaal",
    tag: "Extra gebakken groenten",
    blurb: "Onze schotels met gebakken champignons, paprika en uien.",
    items: [
      { name: "Schotel hamburger speciaal", price: 1400, from: true },
      { name: "Schotel döner speciaal", price: 1700, from: true },
      { name: "Schotel kipdöner speciaal", price: 1700, from: true },
      { name: "Schotel adana speciaal", price: 1850, from: true },
      { name: "Schotel kipfilet speciaal", price: 1850, from: true },
      { name: "Schotel gyros speciaal", price: 1850, from: true },
      { name: "Schotel sjasliek speciaal", price: 1850, from: true },
      { name: "Schotel shoarma speciaal", price: 1850, from: true },
      { name: "Schotel yaprak speciaal", price: 2050, from: true }
    ]
  },
  {
    id: "mix-schotels",
    title: "Mix schotels",
    tag: "Om te delen",
    blurb: "Meerdere soorten vlees op één bord, ideaal om samen te eten.",
    items: [
      { name: "Mix schotel 2 soorten vlees", price: 2000 },
      { name: "Mix schotel 3 soorten vlees", price: 2300 },
      { name: "Mix schotel 4 soorten vlees", price: 2500 },
      { name: "Mega mix schotel 2/3 personen", price: 4950, desc: "5 soorten vlees, 2 Turkse broden, halve zak friet, apart bakje salade en 5 sauzen naar keuze" }
    ]
  },
  {
    id: "kapsalon",
    title: "Kapsalon",
    tag: "De klassieker",
    blurb: "Friet, vlees, gesmolten kaas, verse salade en saus in één bak.",
    items: [
      { name: "Kapsalon döner", price: 1250 },
      { name: "Kapsalon kipdöner", price: 1250 },
      { name: "Kapsalon falafel", price: 1250 },
      { name: "Kapsalon shoarma", price: 1400 },
      { name: "Kapsalon kipfilet", price: 1400 },
      { name: "Kapsalon yaprak", price: 1500 },
      { name: "Kapsalon frikandel", price: 1250 },
      { name: "Kapsalon mix", price: 1350, desc: "Mix van kip- en kalfsdöner" },
      { name: "Kapsalon döner XL", price: 1500 },
      { name: "Kapsalon kipdöner XL", price: 1500 },
      { name: "Kapsalon falafel XL", price: 1500 },
      { name: "Kapsalon shoarma XL", price: 1650 },
      { name: "Kapsalon kipfilet XL", price: 1650 },
      { name: "Kapsalon yaprak XL", price: 1750 },
      { name: "Kapsalon frikandel XL", price: 1500 },
      { name: "Kapsalon mix XL", price: 1600, desc: "Mix van kip- en kalfsdöner" }
    ]
  },
  {
    id: "kebab-boxen",
    title: "Kebab boxen",
    tag: "Handig meenemen",
    blurb: "Vlees en friet in een box, snel en makkelijk onderweg.",
    items: [
      { name: "Kebab box döner", price: 800 },
      { name: "Kebab box kipdöner", price: 800 },
      { name: "Kebab box shoarma", price: 950 },
      { name: "Kebab box kipfilet", price: 950 }
    ]
  },
  {
    id: "lahmacun",
    title: "Lahmacun",
    tag: "Turkse pizza",
    blurb: "Dun, knapperig deeg belegd en opgerold met verse groenten.",
    items: [
      { name: "Lahmacun", price: 600 },
      { name: "Lahmacun döner", price: 800 },
      { name: "Lahmacun kip", price: 800 }
    ]
  },
  {
    id: "kip",
    title: "Kip",
    tag: "Wings & strips",
    blurb: "Krokante hotwings en chicken strips, los of als menu met friet.",
    items: [
      { name: "Hotwings 3 stuks", price: 450, from: true },
      { name: "Hotwings 6 stuks", price: 750, from: true },
      { name: "Hotwings 10 stuks", price: 1000, from: true },
      { name: "Hotwings 15 stuks", price: 1400, from: true },
      { name: "Hotwings 20 stuks", price: 1750, from: true },
      { name: "Hotwings menu", price: 1250, from: true, desc: "6 hotwings met friet en frisdrank" },
      { name: "Bucket 1", price: 1250, from: true, desc: "4 kipnuggets, 3 hotwings en 3 chicken strips met friet en frisdrank" },
      { name: "Bucket 2", price: 2000, from: true, desc: "8 kipnuggets, 8 hotwings en 8 chicken strips met friet en 2 frisdrank" },
      { name: "Chickenstrips 3 stuks", price: 450, from: true },
      { name: "Chickenstrips 6 stuks", price: 850, from: true },
      { name: "Chickenstripsmenu", price: 1250, from: true, desc: "5 chicken strips met friet en frisdrank" }
    ]
  },
  {
    id: "snacks",
    title: "Snacks",
    tag: "Vers gefrituurd",
    blurb: "Gefrituurde klassiekers, het lekkerst als je er meteen bij bent.",
    items: [
      { name: "Frikandel", price: 250, from: true },
      { name: "Frikandel speciaal", price: 300, from: true },
      { name: "Rundvlees kroket", price: 250, from: true },
      { name: "Kaassoufflé", price: 250, from: true },
      { name: "Mexicano", price: 300, from: true },
      { name: "Kipcorn", price: 275, from: true },
      { name: "Sitostick", price: 350, from: true },
      { name: "Kipnuggets 5 stuks", price: 300, from: true },
      { name: "Bitterballen 5 stuks", price: 300, from: true },
      { name: "Bamischijf pikant", price: 275, from: true },
      { name: "Hamburger", price: 500, from: true, desc: "Rond Turks broodje met sla, tomaat en komkommer" },
      { name: "Kipburger", price: 500, from: true, desc: "Rond Turks broodje met sla, tomaat en komkommer" },
      { name: "Falafel", price: 550, from: true },
      { name: "Snackmenu", price: 850, from: true, desc: "2 snacks met friet en salade" },
      { name: "Viandel", price: 300 },
      { name: "Mini loempia", price: 300, desc: "5 stuks" },
      { name: "Crizlystick", price: 350 }
    ]
  },
  {
    id: "frites",
    title: "Frites",
    tag: "Vers gesneden",
    blurb: "Verse friet, dagelijks gesneden. Sauzen los verkrijgbaar.",
    items: [
      { name: "Gezinszak 2/3 personen", price: 750, desc: "Verse frites" },
      { name: "Gezinszak 4/5 personen", price: 950, desc: "Verse frites" }
    ]
  },
  {
    id: "salades",
    title: "Salades",
    tag: "Fris & licht",
    blurb: "Verse salades met knapperige groenten.",
    items: [
      { name: "Gemengde salade", price: 750 },
      { name: "Feta salade", price: 850 },
      { name: "Tonijn salade", price: 850 }
    ]
  },
  {
    id: "dranken",
    title: "Dranken",
    tag: "Koud & fris",
    blurb: "Frisdrank, sappen en de onmisbare ayran.",
    items: [
      { name: "Ayran 250 ml", price: 200 },
      { name: "Chaudfontaine water 500 ml", price: 285 },
      { name: "Coca-Cola 330 ml", price: 300 },
      { name: "Coca-Cola Zero 330 ml", price: 300 },
      { name: "Fanta Orange 330 ml", price: 300 },
      { name: "Fanta Cassis 330 ml", price: 300 },
      { name: "Dr. Pepper 330 ml", price: 300 },
      { name: "Sprite Zero 330 ml", price: 300 },
      { name: "Lipton Ice Tea Sparkling 330 ml", price: 300 },
      { name: "Lipton Ice Tea Green 330 ml", price: 300 },
      { name: "Fernandes Cherry 330 ml", price: 300 },
      { name: "Fernandes Red Grape 330 ml", price: 300 },
      { name: "Fernandes Green Punch 330 ml", price: 300 },
      { name: "Fernandes Super Pineapple 330 ml", price: 300 },
      { name: "Appelsap 330 ml", price: 300 },
      { name: "Chocomel 250 ml", price: 350 },
      { name: "Fristi 250 ml", price: 350 },
      { name: "AA Drink 330 ml", price: 350 },
      { name: "Red Bull 250 ml", price: 350 },
      { name: "Red Bull Suikervrij 250 ml", price: 350 }
    ]
  },
  {
    id: "extras",
    title: "Extra's",
    tag: "Sauzen & brood",
    blurb: "Maak het af met een extra saus of vers Turks brood.",
    items: [
      { name: "Knoflooksaus", price: 50 },
      { name: "Sambal", price: 50 },
      { name: "Cocktailsaus", price: 50 },
      { name: "Mayonaise", price: 50 },
      { name: "Turks brood", price: 100 }
    ]
  }
];

/* Openingstijden. 0 = zondag ... 6 = zaterdag. Tijden in minuten na middernacht. */
window.HAKIKI_HOURS = {
  1: { open: 600, close: 1200, label: "10:00 – 20:00" }, // ma
  2: { open: 600, close: 1200, label: "10:00 – 20:00" }, // di
  3: { open: 600, close: 1200, label: "10:00 – 20:00" }, // wo
  4: { open: 600, close: 1200, label: "10:00 – 20:00" }, // do
  5: { open: 600, close: 1260, label: "10:00 – 21:00" }, // vr
  6: { open: 600, close: 1200, label: "10:00 – 20:00" }, // za
  0: { open: 720, close: 1200, label: "12:00 – 20:00" }  // zo
};
