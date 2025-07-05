import Link from "next/link"
import Image from "next/image"
import "./styles/intro.css"

export default function LandingPage() {
  return (
    <div className="container">
      <div className="logo">
        <h1 className="title">EnerLink</h1>
        <Image src="/material-symbols_link.svg" width={55} height={55} className="title2" alt="link" />
      </div>

      <div className="ener-img-container">
        <Image src="/pay.png" alt="Pay" width={247} height={247} className="ener-img" />
      </div>

      <h2 className="ener-txt">Jump start your crypto portfolio</h2>
      <p className="txt">Make seamless payment for all network providers via crypto coins</p>
      <p className="get-txt">Get Started</p>

      {/* Action Buttons */}
      <div className="sign-container">
        <Link href="/signin">
          <button className="sign-in">
            <span className="sign-txt">Sign in</span>
          </button>
        </Link>
        <Link href="/signup">
          <button className="sign-up">
            <span className="sign-txt">Create an account</span>
          </button>
        </Link>
      </div>
    </div>
  )
}
