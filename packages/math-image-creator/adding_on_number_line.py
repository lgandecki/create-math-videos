from manim import *

class AddingOnNumberLine(Scene):
    def construct(self):
        # Display the title "Adding on the Number Line"
        title = Text("Adding on the Number Line", font_size=48, color=BLUE)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(1)
        
        # Show a simple number line from 0 to 10
        number_line = NumberLine(
            x_range=[0, 10, 1],
            length=8,
            color=WHITE,
            include_numbers=True,
            label_direction=DOWN,
            font_size=36
        )
        number_line.move_to(ORIGIN)
        
        self.play(Create(number_line))
        self.wait(1)
        
        # Add text: "A visual way to understand addition!"
        description = Text("A visual way to understand addition!", font_size=36, color=GREEN)
        description.to_edge(DOWN)
        self.play(Write(description))
        self.wait(2)
        
        # Keep everything on screen for a moment
        self.wait(1)