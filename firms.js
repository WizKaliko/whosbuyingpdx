/* Who paid each firm, Jan 1 2025 – mid-Oct 2026: ORESTAR payee-name searches across every Oregon committee (pulled Oct 19, 2026).
   Cash payments only; "owed" = bills reported but not yet paid.
   tag: b = business-backed side in Portland's 2026 races; c = Portland conservatives (as defined on The donors page);
        p = Democratic party, Democratic officeholders, labor and progressive groups; o = other (judges, local measures, industry PACs). */
window.FIRMS=[
 {n:'Springwater Partners', what:'General consultant (Lake Oswego and Salt Lake City)', pay:[
   ['Olivia Clark','b',102739],['Kellie Torres','b',98816],
   ['Rep. Daniel Nguyen','p',145886],['Rep. Lisa Reynolds','p',18880],
   ['Hank Sanders','o',58273],['We Care for Oregon','o',43000],['Peter for Judge','o',21169],['Savage for Judge','o',12864],['Community Safety Coalition','o',10000],['Virginia La Forte (school board)','o',2800]],
   earlier:'Earlier: Jo Ann Hardesty 2022 ($418K), Chloe Eudaly 2020 ($158K), Carmen Rubio 2020 ($109K), Olivia Clark 2024 ($114K), Democratic Party of Oregon 2024 ($73K), the 2020 police-oversight measure ($66K).'},
 {n:'Untidy Origins', what:'Digital and broadcast ads, production (Portland)', pay:[
   ['Steve Novick','b',80320],['Julia Brim-Edwards','b',68859,82859],
   ['Mitch Green','p',30000],['Nafisa Fai (Washington County)','p',98129,78500],['Citizen Action for Political Education (OEA)','p',53029],['OEA-PAC','p',28150],['Oregon Working Families Party','p',20000],['Tobias Read','p',20000],['Portland Association of Teachers PAC','p',8000],
   ['Tammy for Oregon','o',62695],['Washington County Ignite','o',60023,16650],['Oregon Survivors United for Accountability','o',52568],['Oregon Beverage PAC','o',35513],['Yes for Eugene Clean Energy Fund','o',34925],['Portlanders for Parks','o',33800],['Myrna for Oregon','o',32922,88126],['8 more local and legislative campaigns','o',44809],['Dan Rayfield','p',300]],
   note:'Mitch Green is the progressive councilor running in District 4. Untidy Origins works for him and, this month, for Novick and Brim-Edwards.'},
 {n:'Winning Mark', what:'Political consulting, media and mail (Portland)', pay:[
   ['Steve Novick','b',35902],['Julia Brim-Edwards','b',12500],
   ['Rene Gonzalez','c',8000,8000],
   ['Democratic Party of Oregon','p',680976],['Gov. Tina Kotek','p',130400],['Future PAC (House Democrats)','p',12500],['Friends of Hoa','p',10000],['Ricki for Oregon','p',5000],['Working for a Better Portland (labor)','p',609],
   ['Oregon Beverage PAC','o',148944]],
   earlier:'Earlier: Kotek $3.7M since 2022; Our Oregon voter guides; OLCV PAC; Brim-Edwards $159K since 2023; Hold Politicians Accountable 2022 ($475K).'},
 {n:'Mission Control', what:'Direct mail (Cromwell, Connecticut)', pay:[
   ['Eli Arnold','b',155951],
   ['Democratic Party of Oregon','p',277280],['Senate Democratic Leadership Fund','p',4883],
   ['Elect Virginia Stapleton','o',37328],['Jo Perini-Abbott for Judge','o',32533],['Two other judge races','o',3334]]},
 {n:'Hamburger Group Creative', what:'Ad production and online ads (Washington, DC)', pay:[
   ['Unity PAC','b',219625,139589]], note:'Its only Oregon client this cycle. Unity PAC is funded by the Chamber PAC plus the firefighters’ and Keep Portland Safe PACs.'},
 {n:'Affiliated Media', what:'Billboards and outdoor ads (Portland)', pay:[
   ['DitchMitch','b',73673,97346],['fix multCo','b',73673,97346],
   ['Washington County Safe Communities','o',25000],['Building A Better Tigard','o',20000]], note:'DitchMitch and fix multCo are funded entirely by goPDX, which is funded entirely by the Chamber PAC.'},
 {n:'Leverenz & Associates', what:'Public relations (Portland)', pay:[
   ['Go Portland Go','b',58989],['Oregon Hospital PAC','o',10400]]},
 {n:'Patinkin Research Strategies', what:'Polling (Gig Harbor, Washington)', pay:[['Julia Brim-Edwards','b',58300]], note:'Paid by the candidate personally and reported to her committee.'},
 {n:'Swift Public Affairs', what:'Consulting and lobbying (Portland)', pay:[
   ['Julia Brim-Edwards','b',26000],['Portland Alliance PAC','b',10000,10000],
   ['Yes for Salem Livability','o',64691,25094],['Portlanders for Parks','o',58370,22000],['Wilsonville Voices United','o',36416,31463],['Friends of Alex Phan','o',28995,21000],['Linn United PAC','o',28900],['Protect Our City Services','o',6258,7000]],
   earlier:'Earlier: the Chamber’s Coalition for Portland’s Future 2024 ($174K), Vadim Mozyrsky 2024 ($55K).'},
 {n:'Purple State Strategies', what:'Texting, online ads, voter data (Vancouver, Washington)', pay:[
   ['Eli Arnold','b',18432],['Eric Zimmerman','b',5708],['Julia Brim-Edwards','b',4500],['Rene Gonzalez','c',1832],['Fixing Multnomah County','o',375]],
   earlier:'Earlier: Jessie Burke’s Positivity PAC 2024; Arnold and Zimmerman 2024.'},
 {n:'Elevated Campaigns', what:'Mail, ads and polling (Chicago)', pay:[
   ['Portland Alliance PAC','b',19700,43700],['Pam Treece','c',2500],
   ['Democratic Party of Lane County','p',30379],
   ['Protect Our County','o',414332,122634],['Heather Buch (Lane County)','o',193699]],
   earlier:'Earlier: $739K from the Chamber’s Coalition for Portland’s Future in 2024, and about $470K from the Chamber PAC in 2020.'},
 {n:'The Rally Point', what:'Campaign management and compliance (Portland)', pay:[
   ['Oregon Prosperity Action Fund','b',20100,10100],['goPDX','b',6000],['Portland Alliance PAC','b',2705],['Oregon Realtors PAC','o',4000,8000],
   ['Rep. Daniel Nguyen','p',3300,3300],['Judges, city and school races (11)','o',100242]],note:'Run by Annie Ellison, who led Emerge Oregon (which trains Democratic women to run for office) until 2024, then left to consult on council races (Willamette Week, June 23, 2024). goPDX, the Chamber-funded committee behind the DitchMitch and fix multCo billboards, paid it $6K on Sept 25.'},
 {n:'City Wins', what:'Campaign management (Portland)', pay:[['Kellie Torres','b',11250]]},
 {n:'Square Cap Media', what:'Video (Portland)', pay:[['Go Portland Go','b',10000],['Kellie Torres','b',0,2000]]},
 {n:'CN4 Partners', what:'Mail and media (Seattle)', pay:[['Eric Zimmerman','b',3270]],
   earlier:'Earlier: Zimmerman 2024 ($66K, filed as Cerillion N4 Partners). Its own site lists Democratic clients such as Gretchen Whitmer, Jay Inslee, SEIU and AFSCME, and wins for Rene Gonzalez, Nathan Vasquez and Dan Ryan.'}
];
