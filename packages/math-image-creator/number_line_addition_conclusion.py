from manim import *

class NumberLineAdditionConclusion(Scene):
    def construct(self):
        # Title
        title = Text("Section: Conclusion", font_size=48).to_edge(UP)
        self.play(Write(title))
        self.wait(1)
        
        # Summary header
        summary_header = Text("To add on a number line:", font_size=36).move_to(UP * 2)
        self.play(Write(summary_header))
        self.wait(1)
        
        # Method steps
        step1 = Text("1. Start at the first number.", font_size=28).move_to(UP * 1)
        step2 = Text("2. Move right by the second number's value.", font_size=28).move_to(UP * 0.3)
        step3 = Text("3. The landing spot is your sum!", font_size=28).move_to(DOWN * 0.4)
        
        self.play(Write(step1))
        self.wait(0.8)
        self.play(Write(step2))
        self.wait(0.8)
        self.play(Write(step3))
        self.wait(1.5)
        
        # Fade out text to show number line demonstration
        self.play(FadeOut(title), FadeOut(summary_header), FadeOut(step1), FadeOut(step2), FadeOut(step3))
        self.wait(0.5)
        
        # Create number line
        number_line = NumberLine(
            x_range=[0, 10, 1],
            length=10,
            color=WHITE,
            include_numbers=True,
            label_direction=DOWN,
            font_size=24
        ).move_to(ORIGIN)
        
        self.play(Create(number_line))
        self.wait(1)
        
        # Generic demonstration text
        demo_text = Text("Generic demonstration: a + b", font_size=32).to_edge(UP)
        self.play(Write(demo_text))
        self.wait(1)
        
        # Create starting point indicator
        start_point = Dot(number_line.number_to_point(3), color=BLUE, radius=0.1)
        start_label = Text("Start here (a)", font_size=24, color=BLUE).next_to(start_point, UP)
        
        self.play(Create(start_point), Write(start_label))
        self.wait(1)
        
        # Create jump arrow
        jump_distance = 4  # This represents 'b'
        end_point = number_line.number_to_point(3 + jump_distance)
        
        # Create curved arrow for the jump
        jump_arrow = CurvedArrow(
            start_point.get_center(),
            [end_point[0], end_point[1], 0],
            color=GREEN,
            stroke_width=4,
            tip_length=0.2
        )
        
        jump_label = Text("Jump right by b", font_size=24, color=GREEN).next_to(jump_arrow, UP, buff=0.3)
        
        self.play(Create(jump_arrow), Write(jump_label))
        self.wait(1.5)
        
        # Create landing point
        landing_point = Dot([end_point[0], end_point[1], 0], color=RED, radius=0.1)
        landing_label = Text("Sum = a + b", font_size=24, color=RED).next_to(landing_point, UP)
        
        self.play(Create(landing_point), Write(landing_label))
        self.wait(2)
        
        # Highlight the complete process with a box
        highlight_box = SurroundingRectangle(
            VGroup(start_point, jump_arrow, landing_point),
            color=YELLOW,
            buff=0.3,
            stroke_width=3
        )
        
        self.play(Create(highlight_box))
        self.wait(1)
        
        # Final summary text
        final_text = Text("Start → Jump Right → Land on Sum!", font_size=32, color=YELLOW).to_edge(DOWN)
        self.play(Write(final_text))
        self.wait(3)
        
        # Fade out everything
        all_objects = VGroup(
            demo_text, number_line, start_point, start_label,
            jump_arrow, jump_label, landing_point, landing_label,
            highlight_box, final_text
        )
        self.play(FadeOut(all_objects))
        self.wait(1)