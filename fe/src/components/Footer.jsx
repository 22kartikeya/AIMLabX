import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
    return (
        <footer className="w-full bg-background/30 backdrop-blur-md border-t border-black/10 mb-0">
            <div className="container mx-auto px-4 py-3 flex flex-wrap justify-between items-center text-sm text-black">
                <div className="flex items-center space-x-4">
                    <a
                        href="https://github.com/22kartikeya/AIMLabX.git"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                    >
                        <FontAwesomeIcon
                            icon={faGithub}
                            className="w-5 h-5 hover:text-gray-700 transition-colors"
                        />
                    </a>
                    <a
                        href="https://www.linkedin.com/in/kartikeya-gupta-81a421251/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                    >
                        <FontAwesomeIcon
                            icon={faLinkedin}
                            className="w-5 h-5 hover:text-gray-700 transition-colors"
                        />
                    </a>
                    <a href="/about" className="hover:text-gray-700 transition-colors">
                        About
                    </a>
                </div>
                <div className="text-sm mt-2 sm:mt-0">
                    <span>© 2025 </span>
                    <span className="font-semibold">AIMLabX</span>
                    <span> | All rights reserved.</span>
                </div>
            </div>
        </footer>
    );
}