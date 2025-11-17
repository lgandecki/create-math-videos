from manim import *

class HelloWorldProgram(Scene):
    def construct(self):
        # Create the title text
        title = Text("The 'Hello World' Program", font_size=48, color=BLUE)
        
        # Display the title
        self.play(Write(title))
        self.wait(2)
        
        # Fade out the title
        self.play(FadeOut(title))
        self.wait(1)