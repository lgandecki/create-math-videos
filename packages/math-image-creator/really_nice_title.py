from manim import *

class ReallyNiceTitle(Scene):
    def construct(self):
        title = Text("Super Really nice", font_size=72, color=BLUE)
        
        self.play(Write(title))
        self.wait(2)
        self.play(FadeOut(title))
        self.wait(1)