import React from "react";
import PublicHeader from "../../components/layout/PublicHeader";
import PublicFooter from "../../components/layout/PublicFooter";

export default function PrivacyPolicyPage() {
  return (
    <div className="privacy-page">
      <PublicHeader />

      <main className="privacy-wrap">
        <article className="privacy-card">
          <div className="privacy-hero">
            <span>Publiko.biz</span>
            <h1>Politika e Privatësisë</h1>
            <p>
              Platforma Publiko respekton privatësinë tuaj dhe angazhohet për
              mbrojtjen e të dhënave personale në përputhje me ligjet në fuqi.
            </p>
          </div>

          <section>
            <h2>1. Të dhënat që mbledhim</h2>
            <p>
              Publiko.biz nuk kërkon krijim llogarie ose kyçje nga përdoruesit
              publikë.
              <br />
              <br />
              Ne mund të mbledhim të dhëna vetëm kur ato dërgohen vullnetarisht
              nga përdoruesi, biznesi ose klienti, si:
              <br />• Emri dhe mbiemri / emri i biznesit
              <br />• Numri i telefonit / WhatsApp
              <br />• Email-i
              <br />• Përmbajtja e shpalljes ose reklamës
              <br />• Mesazhet e dërguara përmes formave të kontaktit
              <br />• Të dhëna analitike bazë si shikime, klikime dhe përdorim i platformës
            </p>
          </section>

          <section>
            <h2>2. Përdorimi i të dhënave</h2>
            <p>
              Të dhënat përdoren për:
              <br />• Publikimin dhe menaxhimin e shpalljeve
              <br />• Kontakt me klientët ose bizneset që kërkojnë shërbim
              <br />• Përgjigje ndaj kërkesave për reklamim
              <br />• Përmirësimin e platformës
              <br />• Matjen e performancës së reklamave
            </p>
          </section>

          <section>
            <h2>3. Shpërndarja e të dhënave</h2>
            <p>
              Publiko nuk shet të dhënat tuaja personale. Të dhënat mund të
              shfaqen publikisht vetëm kur janë pjesë e një shpalljeje ose
              reklame të kërkuar nga vetë klienti, si numri i telefonit,
              WhatsApp-i, email-i ose informata të biznesit.
            </p>
          </section>

          <section>
            <h2>4. Cookies dhe analiza</h2>
            <p>
              Platforma mund të përdorë cookies dhe teknologji të ngjashme për:
              <br />• Analizimin e trafikut
              <br />• Përmirësimin e përvojës së përdoruesit
              <br />• Matjen e shikimeve dhe klikimeve
              <br />• Statistika për reklama dhe shpallje
              <br />
              <br />
              Këto të dhëna përdoren për qëllime statistikore dhe nuk synojnë
              identifikimin personal të vizitorëve publikë.
            </p>
          </section>

          <section>
            <h2>5. Siguria</h2>
            <p>
              Ne përdorim masa teknike dhe organizative për të mbrojtur të
              dhënat nga qasja e paautorizuar, keqpërdorimi ose ndryshimi i
              paautorizuar.
            </p>
          </section>

          <section>
            <h2>6. Të drejtat tuaja</h2>
            <p>
              Ju mund të kërkoni:
              <br />• Përmirësimin ose ndryshimin e tyre
              <br />• Fshirjen e tyre nga sistemi ynë
              <br />• Largimin ose ndryshimin e një shpalljeje/reklame të publikuar
            </p>
          </section>

          <section>
            <h2>7. Ndryshimet në politikë</h2>
            <p>
              Publiko rezervon të drejtën të ndryshojë këtë politikë në çdo
              kohë. Ndryshimet hyjnë në fuqi pas publikimit në platformë.
            </p>
          </section>

          <section>
            <h2>8. Kontakt</h2>
            <p>
              Për pyetje, kërkesa ose largim të të dhënave:
              <br />📧 ihgkosova@gmail.com
              <br />📞 044 000 000
            </p>
          </section>
        </article>
      </main>

      <PublicFooter />

      <style>{`
        .privacy-page{
          min-height:100vh;
          background:
            radial-gradient(circle at 20% 0%, rgba(56,189,248,.28), transparent 34%),
            linear-gradient(180deg,#dff3ff 0%, #f8fbff 58%, #ffffff 100%);
          color:#0f172a;
        }

        .privacy-wrap{
          max-width:1120px;
          margin:0 auto;
          padding:105px 18px 86px;
        }

        .privacy-card{
          background:rgba(255,255,255,.94);
          border:1px solid rgba(226,232,240,.95);
          border-radius:26px;
          padding:48px;
          box-shadow:0 24px 70px rgba(15,23,42,.08);
        }

        .privacy-hero{
          margin-bottom:34px;
          padding-bottom:26px;
          border-bottom:1px solid #e2e8f0;
        }

        .privacy-hero span{
          display:inline-flex;
          margin-bottom:14px;
          padding:8px 12px;
          border-radius:999px;
          background:#e0f2fe;
          color:#0369a1;
          font-size:12px;
          font-weight:900;
          letter-spacing:.04em;
          text-transform:uppercase;
        }

        .privacy-hero h1{
          margin:0 0 14px;
          font-size:42px;
          line-height:1;
          letter-spacing:-.055em;
          font-weight:950;
          color:#07142d;
        }

        .privacy-hero p{
          max-width:820px;
          margin:0;
          color:#475569;
          font-size:17px;
          line-height:1.75;
        }

        .privacy-card section{
          margin-bottom:28px;
        }

        .privacy-card section:last-child{
          margin-bottom:0;
        }

        .privacy-card h2{
          margin:0 0 10px;
          font-size:21px;
          line-height:1.2;
          color:#07142d;
          font-weight:900;
          letter-spacing:-.025em;
        }

        .privacy-card p{
          margin:0;
          color:#334155;
          line-height:1.85;
          font-size:15.8px;
        }

        @media(max-width:768px){
          .privacy-wrap{
            padding:92px 12px 64px;
          }

          .privacy-card{
            padding:28px 20px;
            border-radius:22px;
          }

          .privacy-hero h1{
            font-size:31px;
          }

          .privacy-hero p{
            font-size:15.5px;
          }

          .privacy-card h2{
            font-size:19px;
          }

          .privacy-card p{
            font-size:15px;
          }
        }
      `}</style>
    </div>
  );
}