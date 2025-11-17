from manim import *

class AdditionOnNumberLineIntro(Scene):
    def construct(self):
        # Display the title "Addition on a Number Line?"
        title = Text("Addition on a Number Line?", font_size=64, color=WHITE)
        title.to_edge(UP, buff=1)
        
        self.play(Write(title))
        self.wait(1)
        
        # Create number line ranging from 0 to 10
        number_line = NumberLine(
            x_range=[0, 10, 1],
            length=10,
            color=WHITE,
            include_numbers=True,
            label_direction=DOWN,
            font_size=24
        )
        number_line.center()
        
        # Show the number line appearing
        self.play(Create(number_line))
        self.wait(1)
        
        # Introduce the concept with explanatory text
        concept_text = Text(
            "The number line is a powerful tool to visualize addition!",
            font_size=36,
            color=GREEN
        )
        concept_text.to_edge(DOWN, buff=1)
        
        self.play(Write(concept_text))
        self.wait(2)
        
        # Keep everything on screen for a moment
        self.wait(1)