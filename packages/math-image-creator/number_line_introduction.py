from manim import *

class NumberLineIntroduction(Scene):
    def construct(self):
        # Create the title
        title = Text("Exploring Operations on the Number Line", font_size=64, color=YELLOW)
        title.to_edge(UP, buff=0.8)
        
        # Create number line from -5 to 10
        number_line = NumberLine(
            x_range=[-5, 10, 1],
            length=12,
            include_numbers=True,
            numbers_to_include=range(-5, 11),
            font_size=36,
            tick_size=0.1
        )
        number_line.move_to(ORIGIN)
        
        # Create purpose statement
        purpose = Text(
            "The number line helps us visualize addition and multiplication.",
            font_size=36
        )
        purpose.next_to(number_line, DOWN, buff=1.5)
        
        # Animation sequence
        self.play(Write(title))
        self.wait(1)
        
        self.play(Create(number_line))
        self.wait(2)
        
        self.play(Write(purpose))
        self.wait(3)
        
        # Final pause to let viewers read everything
        self.wait(2)