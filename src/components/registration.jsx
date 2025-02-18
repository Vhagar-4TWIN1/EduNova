
import Video from "../assets/video.mp4";
import axios from "axios";

const Registration = () => {
    return (
        <div className="login-main">
            <div className="login-left">
            <video autoPlay loop muted className="background-video">
        <source src={Video} type="video/mp4" />
        Your browser does not support the video tag.
            </video>
            </div>
            <div className="login-right">
                <div className="login-right-container">
                    <div className="login-logo">
                      
                    </div>
                    <div className="login-center">
                        <h2>Welcome back!</h2>
                        <p>Please enter your details</p>
                        <form>
                            <input type="text" placeholder="First Name" />
                            <input type="text" placeholder="Last Name" />
                            <input type="email" placeholder="Email" />
                            <input type="password" placeholder="Password" />
                            <input type="password" placeholder="Confirm Password" />
                            <div className="login-center-buttons">
                                <button type="button">Sign Up</button>
                            </div>
                        </form>
                    </div>
                    <p className="login-bottom-p">
                        Already have an account? <a href="#">Log in</a>
                    </p>
                </div>
            </div>
                

      
        </div>
    );
};
    export default Registration;