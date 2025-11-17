from manim import *

class MultiplicationConclusion(Scene):
    def construct(self):
        # Display summary message
        title = Text("Multiplication on a Number Line:", font_size=36, color=BLUE)
        title.to_edge(UP, buff=1)
        
        line1 = Text("A × B means B jumps of size A,", font_size=32)
        line2 = Text("starting from 0.", font_size=32)
        line3 = Text("The final position is the product.", font_size=32, color=GREEN)
        
        # Group the summary lines
        summary_group = VGroup(line1, line2, line3)
        summary_group.arrange(DOWN, buff=0.5)
        summary_group.move_to(ORIGIN)
        
        # Show title first
        self.play(Write(title))
        self.wait(1)
        
        # Show summary lines one by one
        self.play(Write(line1))
        self.wait(1)
        self.play(Write(line2))
        self.wait(1)
        self.play(Write(line3))
        self.wait(2)
        
        # Move summary up to make room for number line
        self.play(summary_group.animate.shift(UP * 1.5))
        self.wait(0.5)
        
        # Create number line
        number_line = NumberLine(
            x_range=[0, 8, 1],
            length=10,
            color=WHITE,
            include_numbers=True,
            label_direction=DOWN,
            font_size=24
        )
        number_line.shift(DOWN * 2)
        
        # Show number line
        self.play(Create(number_line))
        self.wait(1)
        
        # Create a dot to represent the position
        dot = Dot(number_line.number_to_point(0), color=RED, radius=0.1)
        self.play(Create(dot))
        
        # Example: 3 jumps of size 2 (2 × 3 = 6)
        example_text = Text("Example: 2 × 3", font_size=28, color=YELLOW)
        example_text.next_to(number_line, DOWN, buff=1)
        self.play(Write(example_text))
        self.wait(1)
        
        # Animate 3 jumps of size 2
        jump_size = 2
        num_jumps = 3
        
        for i in range(num_jumps):
            # Show jump arc
            start_point = number_line.number_to_point(i * jump_size)
            end_point = number_line.number_to_point((i + 1) * jump_size)
            
            # Create arc for jump visualization
            arc = Arc(
                start_angle=0,
                angle=PI,
                radius=abs(end_point[0] - start_point[0]) / 2,
                color=BLUE,
                stroke_width=3
            )
            arc.move_to((start_point + end_point) / 2)
            arc.shift(UP * 0.3)
            
            # Jump label
            jump_label = Text(f"Jump {i+1}", font_size=20, color=BLUE)
            jump_label.next_to(arc, UP, buff=0.1)
            
            # Animate the jump
            self.play(
                Create(arc),
                Write(jump_label),
                dot.animate.move_to(end_point),
                run_time=1
            )
            self.wait(0.5)
            
            # Remove the arc and label after a brief pause
            self.play(FadeOut(arc), FadeOut(jump_label), run_time=0.3)
        
        # Final result
        final_position = num_jumps * jump_size
        result_text = Text(f"Final position: {final_position}", font_size=28, color=GREEN)
        result_text.next_to(example_text, DOWN, buff=0.5)
        self.play(Write(result_text))
        
        # Highlight the final position on the number line
        final_highlight = Circle(radius=0.3, color=GREEN, stroke_width=3)
        final_highlight.move_to(dot.get_center())
        self.play(Create(final_highlight))
        
        self.wait(3)
        
        # Fade out everything
        self.play(
            FadeOut(title),
            FadeOut(summary_group),
            FadeOut(number_line),
            FadeOut(dot),
            FadeOut(example_text),
            FadeOut(result_text),
            FadeOut(final_highlight)
        )
        self.wait(1)