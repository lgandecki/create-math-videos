from manim import *

class SimpleNumberLineExamples(Scene):
    def construct(self):
        # Create the title
        title = Text("Simple Number Line Examples", font_size=48)
        title.to_edge(UP, buff=1)
        
        # Display the title
        self.play(Write(title))
        self.wait(1)
        
        # Create a number line from -5 to 5
        number_line = NumberLine(
            x_range=[-5, 5, 1],
            length=10,
            color=WHITE,
            include_numbers=True,
            label_direction=DOWN,
            font_size=24,
            include_ticks=True,
            tick_size=0.1,
        )
        
        # Position the number line in the center
        number_line.move_to(ORIGIN)
        
        # Create arrows at each end
        left_arrow = Arrow(
            start=number_line.get_left() + LEFT * 0.3,
            end=number_line.get_left(),
            color=WHITE,
            buff=0,
            stroke_width=3
        )
        
        right_arrow = Arrow(
            start=number_line.get_right(),
            end=number_line.get_right() + RIGHT * 0.3,
            color=WHITE,
            buff=0,
            stroke_width=3
        )
        
        # Animate the number line and arrows
        self.play(Create(number_line))
        self.play(Create(left_arrow), Create(right_arrow))
        self.wait(1)
        
        # Create introduction text
        intro_text = Text(
            "A number line is a visual tool for understanding\nnumbers and mathematical operations",
            font_size=32,
            color=BLUE
        )
        intro_text.move_to(DOWN * 2)
        
        # Display the introduction text
        self.play(Write(intro_text))
        self.wait(3)
        
        # Final pause
        self.wait(2)