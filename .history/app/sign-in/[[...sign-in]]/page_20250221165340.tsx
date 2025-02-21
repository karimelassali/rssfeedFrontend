import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn
        path="/sign-in"
        afterSignInUrl="/"
        routing="path"
        signUpUrl={null}
        afterSignUpUrl={null}
        appearance={{
          elements: {
            footerAction: "none",
            rootBox: "w-full max-w-md"
          }
        }}
      />
    </div>
  )
}