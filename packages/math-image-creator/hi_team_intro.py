from manim import *

class HiTeamIntro(Scene):
    def construct(self):
        # Create the title text
        title = Text("Hi team! How are you?", font_size=72)
        
        # Display the title
        self.play(Write(title))
        self.wait(1)
        
        # Fade it out
        self.play(FadeOut(title))
        self.wait(0.5)