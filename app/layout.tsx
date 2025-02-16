import "./global.css"

export const metadata = {
    title: "DIU GPT",
    description: "Ask Me Anything to know more about DIU!"
}

const RootLayout = ({children}) => {
    return (
        <html lang="en"> 
        <body>{children}</body>
        </html>
    )
}

export default RootLayout