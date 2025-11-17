from manim import *

class SimpleNumberLineTitle(Scene):
    def construct(self):
        # Create the title text
        title = Text("The Extremely Simple Number Line", font_size=48, color=BLUE)
        
        # Display the title
        self.play(Write(title))
        self.wait(2)
        
        # Fade out the title
        self.play(FadeOut(title))
        self.wait(1)