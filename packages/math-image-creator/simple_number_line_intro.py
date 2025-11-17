from manim import *

class SimpleNumberLineIntro(Scene):
    def construct(self):
        # Create the title
        title = Text("The Simple Number Line", font_size=48)
        title.move_to(ORIGIN)
        
        # Display the title
        self.play(Write(title))
        self.wait(2)
        
        # Fade out the title
        self.play(FadeOut(title))
        self.wait(1)