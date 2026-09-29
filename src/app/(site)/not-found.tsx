import Link from 'next/link'
export default function NotFound() {
  return (
    <div className="section"><div className="wrap">
      <p className="kicker">Błąd 404</p>
      <h1 className="h2">Tej strony tu nie ma</h1>
      <p className="lead">Adres mógł się zmienić albo wkradła się literówka.</p>
      <div className="cta-row">
        <Link className="btn btn-solid" href="/">Strona główna</Link>
        <Link className="btn btn-line" href="/produkty">Katalog</Link>
      </div>
    </div></div>
  )
}
